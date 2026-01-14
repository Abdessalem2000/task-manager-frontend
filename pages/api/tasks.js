import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
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
  console.log('🔥 API Route Hit:', req.method, req.url);
  console.log('🔥 Request headers:', req.headers);
  console.log('🔥 Request body:', req.body);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    console.log('🔥 OPTIONS request - returning 200');
    return res.status(200).end();
  }

  await connectDB();

  try {
    switch (req.method) {
      case 'GET':
        const tasks = await Task.find({ user: 'demo-user' }).sort({ createdAt: -1 });
        return res.status(200).json(tasks);

      case 'POST':
        const { name, priority = 'medium', category = 'work' } = req.body;
        
        if (!name || name.trim() === '') {
          return res.status(400).json({ error: 'Task name is required' });
        }

        const task = await Task.create({
          name: name.trim(),
          priority,
          category,
          user: 'demo-user'
        });

        return res.status(201).json(task);

      case 'PUT':
        const { id, completed, name: updateName } = req.body;
        
        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { 
            completed, 
            name: updateName,
            updatedAt: new Date() 
          },
          { new: true }
        );

        if (!updatedTask) {
          return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json(updatedTask);

      case 'DELETE':
        const { taskId } = req.query;
        
        const deletedTask = await Task.findByIdAndDelete(taskId);
        
        if (!deletedTask) {
          return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
