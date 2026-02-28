import mongoose from 'mongoose';
import { getAuth } from '@clerk/nextjs/server';

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }
      
      await mongoose.connect(process.env.MONGODB_URI);
    }
  } catch (error) {
    throw error;
  }
};

// Task Schema with userId for multi-tenancy
const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, enum: ['work', 'personal', 'shopping'], default: 'work' },
  userId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get authenticated user from Clerk
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - Please sign in' });
  }

  try {
    // Connect to MongoDB
    await connectDB();
  } catch (error) {
    return res.status(500).json({ error: 'Database connection failed', timestamp: new Date().toISOString() });
  }

  if (req.method === 'POST') {
    try {
      const { name, priority = 'medium', category = 'work' } = req.body || {};
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Task name is required' });
      }
      
      // Create task with authenticated userId
      const task = new Task({
        name: name.trim(),
        priority,
        category,
        userId
      });
      
      await task.save();
      
      return res.status(201).json({ task, dbConnected: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      // Fetch tasks for authenticated user only
      const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
      
      return res.status(200).json({ tasks, dbConnected: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { taskId } = req.query;
      if (!taskId) {
        return res.status(400).json({ error: 'Task ID is required' });
      }
      
      const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      return res.status(200).json({ message: 'Task deleted successfully', dbConnected: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { taskId } = req.query;
      const { completed } = req.body;
      
      if (!taskId) {
        return res.status(400).json({ error: 'Task ID is required' });
      }
      
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { completed, updatedAt: new Date() },
        { new: true }
      );
      
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      return res.status(200).json({ ...updatedTask.toObject(), dbConnected: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
