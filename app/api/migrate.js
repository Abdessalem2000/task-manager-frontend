import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
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

// Task Schema with userId
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    console.log('🔄 Starting migration...');
    
    // Find all tasks without userId (old format)
    const oldTasks = await Task.find({ userId: { $exists: false } });
    
    if (oldTasks.length === 0) {
      console.log('✅ No tasks to migrate');
      return res.status(200).json({ 
        message: 'No tasks to migrate', 
        migrated: 0,
        total: await Task.countDocuments() 
      });
    }
    
    // Update all old tasks to belong to 'demo-user'
    const result = await Task.updateMany(
      { userId: { $exists: false } },
      { userId: 'demo-user' }
    );
    
    console.log(`✅ Migrated ${result.modifiedCount} tasks to demo-user`);
    
    // Verify migration
    const remainingOldTasks = await Task.find({ userId: { $exists: false } });
    const totalTasks = await Task.countDocuments();
    
    return res.status(200).json({
      message: 'Migration completed successfully',
      migrated: result.modifiedCount,
      remaining: remainingOldTasks.length,
      total: totalTasks
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return res.status(500).json({ 
      error: 'Migration failed', 
      details: error.message 
    });
  }
}
