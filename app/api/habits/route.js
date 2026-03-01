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

// Habit Schema with userId for multi-tenancy
const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  streak: { type: Number, default: 0 },
  category: { type: String, enum: ['health', 'productivity', 'personal', 'learning'], default: 'personal' },
  userId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Habit = mongoose.models.Habit || mongoose.model('Habit', HabitSchema);

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

    // Fetch habits for authenticated user only
    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });
    
    return Response.json({ habits, dbConnected: true }, { headers });
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
    const { name, category = 'personal' } = body || {};
    
    if (!name || name.trim() === '') {
      return Response.json({ error: 'Habit name is required' }, { 
        status: 400, 
        headers 
      });
    }
    
    // Create habit with authenticated userId
    const habit = new Habit({
      name: name.trim(),
      category,
      userId
    });
    
    await habit.save();
    
    return Response.json({ habit, dbConnected: true }, { 
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
    const habitId = searchParams.get('habitId');
    const body = await request.json();
    const { completed } = body;
    
    if (!habitId) {
      return Response.json({ error: 'Habit ID is required' }, { 
        status: 400, 
        headers 
      });
    }
    
    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: habitId, userId },
      { completed, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedHabit) {
      return Response.json({ error: 'Habit not found' }, { 
        status: 404, 
        headers 
      });
    }
    
    return Response.json({ ...updatedHabit.toObject(), dbConnected: true }, { headers });
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
    const habitId = searchParams.get('habitId');
    
    if (!habitId) {
      return Response.json({ error: 'Habit ID is required' }, { 
        status: 400, 
        headers 
      });
    }
    
    const deletedHabit = await Habit.findOneAndDelete({ _id: habitId, userId });
    if (!deletedHabit) {
      return Response.json({ error: 'Habit not found' }, { 
        status: 404, 
        headers 
      });
    }
    
    return Response.json({ message: 'Habit deleted successfully', dbConnected: true }, { headers });
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
