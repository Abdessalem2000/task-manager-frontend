import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // DEBUG: Check if MONGODB_URI is available
      console.log('🔍 MONGODB_URI check:', process.env.MONGODB_URI ? 'DEFINED' : 'UNDEFINED');
      console.log('🔍 MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
      
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }
      
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

// Task Schema
const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, enum: ['work', 'personal', 'shopping'], default: 'work' },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export default async function handler(req, res) {
  // Set CORS headers for same-origin (no CORS issues in unified project)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let dbConnected = false;

  try {
    // Connect to MongoDB for all non-OPTIONS requests
    await connectDB();
    dbConnected = true;
    console.log('🔥 Database connection established');
  } catch (error) {
    console.error('🔥 Database connection failed:', error.message);
    // Continue with mock data if DB fails
  }

  if (req.method === 'POST') {
    try {
      console.log('POST /api/tasks - Request received');
      console.log('Request body:', req.body);
      
      const { name, priority = 'medium', category = 'work' } = req.body || {};
      
      if (!name || name.trim() === '') {
        console.log('Task name validation failed');
        return res.status(400).json({ error: 'Task name is required' });
      }
      
      let task;
      
      if (dbConnected) {
        // Use real MongoDB
        task = new Task({
          name: name.trim(),
          priority,
          category,
          user: 'default-user' // TODO: Get from auth
        });
        
        await task.save();
        console.log('✅ Task saved to MongoDB:', task);
      } else {
        // Fallback to mock data
        task = {
          _id: Date.now().toString(),
          name: name.trim(),
          priority,
          category,
          completed: false,
          user: 'default-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _mock: true
        };
        console.log('⚠️ Task created as mock (no DB):', task);
      }
      
      return res.status(201).json({ ...task, dbConnected });
    } catch (error) {
      console.error('POST /api/tasks - Error:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      console.log('GET /api/tasks - Fetching tasks');
      
      let tasks;
      
      if (dbConnected) {
        // Use real MongoDB
        tasks = await Task.find({ user: 'default-user' }).sort({ createdAt: -1 });
        console.log('✅ Tasks fetched from MongoDB:', tasks.length);
      } else {
        // Fallback to mock data
        tasks = [
          {
            _id: '1',
            name: 'Sample Task 1',
            priority: 'medium',
            category: 'work',
            completed: false,
            user: 'default-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _mock: true
          },
          {
            _id: '2', 
            name: 'Sample Task 2',
            priority: 'high',
            category: 'personal',
            completed: true,
            user: 'default-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _mock: true
          }
        ];
        console.log('⚠️ Mock tasks returned (no DB):', tasks.length);
      }
      
      return res.status(200).json({ tasks, dbConnected });
    } catch (error) {
      console.error('GET /api/tasks - Error:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { taskId } = req.query;
      if (!taskId) {
        return res.status(400).json({ error: 'Task ID is required' });
      }
      
      if (dbConnected) {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
          return res.status(404).json({ error: 'Task not found' });
        }
        console.log('✅ Task deleted from MongoDB:', deletedTask);
      } else {
        console.log('⚠️ Mock task deleted (no DB):', taskId);
      }
      
      return res.status(200).json({ message: 'Task deleted successfully', dbConnected });
    } catch (error) {
      console.error('DELETE /api/tasks - Error:', error);
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
      
      let updatedTask;
      
      if (dbConnected) {
        updatedTask = await Task.findByIdAndUpdate(
          taskId, 
          { completed, updatedAt: new Date() },
          { new: true }
        );
        
        if (!updatedTask) {
          return res.status(404).json({ error: 'Task not found' });
        }
        console.log('✅ Task updated in MongoDB:', updatedTask);
      } else {
        updatedTask = {
          _id: taskId,
          name: 'Updated Task',
          completed,
          user: 'default-user',
          updatedAt: new Date().toISOString(),
          _mock: true
        };
        console.log('⚠️ Mock task updated (no DB):', updatedTask);
      }
      
      return res.status(200).json({ ...updatedTask, dbConnected });
    } catch (error) {
      console.error('PUT /api/tasks - Error:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
