import mongoose from 'mongoose';
import { getAuth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Task Schema
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

export async function POST(request) {
  try {
    // Get authenticated user from Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized - Please sign in' }, { 
        status: 401 
      });
    }

    // Connect to MongoDB
    await connectDB();

    // Get user's tasks
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    
    if (tasks.length === 0) {
      return Response.json({ 
        error: 'No tasks found to optimize' 
      }, { status: 400 });
    }

    // Prepare tasks for OpenAI
    const tasksText = tasks.map(task => 
      `- ${task.name} (Priority: ${task.priority}, Category: ${task.category}, Completed: ${task.completed})`
    ).join('\n');

    // Create OpenAI prompt
    const prompt = `As a productivity expert, analyze these tasks and provide optimization suggestions:

${tasksText}

Please provide:
1. A prioritized task list
2. Time management recommendations
3. Category-based organization tips
4. Any other productivity insights

Respond in a structured, actionable format.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a productivity expert who provides actionable task optimization advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const optimization = completion.choices[0]?.message?.content || 'No optimization available';

    return Response.json({
      success: true,
      optimization,
      taskCount: tasks.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI optimization error:', error);
    return Response.json({
      error: 'Failed to optimize tasks',
      details: error.message
    }, { status: 500 });
  }
}
