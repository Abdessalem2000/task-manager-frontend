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

export async function GET(request) {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });

  try {
    // Get authenticated user from Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized - Please sign in' }, { 
        status: 401, 
        headers 
      });
    }

    // Connect to MongoDB
    await connectDB();

    // Fetch tasks for authenticated user only
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    
    return Response.json({ tasks, dbConnected: true }, { headers });
  } catch (error) {
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { 
      status: 500, 
      headers 
    });
  }
}

export async function POST(request) {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });

  try {
    // Get authenticated user from Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized - Please sign in' }, { 
        status: 401, 
        headers 
      });
    }

    // Connect to MongoDB
    await connectDB();

    const body = await request.json();
    const { name, priority = 'medium', category = 'work' } = body || {};
    
    if (!name || name.trim() === '') {
      return Response.json({ error: 'Task name is required' }, { 
        status: 400, 
        headers 
      });
    }
    
    // Create task with authenticated userId
    const task = new Task({
      name: name.trim(),
      priority,
      category,
      userId
    });
    
    await task.save();
    
    return Response.json({ task, dbConnected: true }, { 
      status: 201, 
      headers 
    });
  } catch (error) {
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { 
      status: 500, 
      headers 
    });
  }
}

export async function PUT(request) {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });

  try {
    // Get authenticated user from Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized - Please sign in' }, { 
        status: 401, 
        headers 
      });
    }

    // Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const body = await request.json();
    const { completed } = body;
    
    if (!taskId) {
      return Response.json({ error: 'Task ID is required' }, { 
        status: 400, 
        headers 
      });
    }
    
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { completed, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedTask) {
      return Response.json({ error: 'Task not found' }, { 
        status: 404, 
        headers 
      });
    }
    
    return Response.json({ ...updatedTask.toObject(), dbConnected: true }, { headers });
  } catch (error) {
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { 
      status: 500, 
      headers 
    });
  }
}

export async function DELETE(request) {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });

  try {
    // Get authenticated user from Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized - Please sign in' }, { 
        status: 401, 
        headers 
      });
    }

    // Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    if (!taskId) {
      return Response.json({ error: 'Task ID is required' }, { 
        status: 400, 
        headers 
      });
    }
    
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!deletedTask) {
      return Response.json({ error: 'Task not found' }, { 
        status: 404, 
        headers 
      });
    }
    
    return Response.json({ message: 'Task deleted successfully', dbConnected: true }, { headers });
  } catch (error) {
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { 
      status: 500, 
      headers 
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  });
}
