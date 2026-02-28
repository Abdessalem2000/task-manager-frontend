import mongoose from 'mongoose';
import { getAuth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk_test_YOUR_OPENAI_KEY_HERE',
});

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get authenticated user
  const { userId } = getAuth(req);
  const currentUserId = userId || 'demo-user';

  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized - Please sign in' });
  }

  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk_test_YOUR_OPENAI_KEY_HERE') {
      return res.status(200).json({
        optimizedTasks: [],
        suggestions: [
          {
            type: 'priority',
            message: '🤖 AI optimization requires OpenAI API key configuration',
            demo: true
          },
          {
            type: 'next_step',
            message: '📋 Focus on high-priority work tasks first',
            demo: true
          },
          {
            type: 'efficiency',
            message: '⚡ Group similar tasks together for better focus',
            demo: true
          }
        ],
        demo: true
      });
    }

    // Connect to database
    await connectDB();

    // Get user's tasks
    const tasks = await Task.find({ userId: currentUserId }).sort({ createdAt: -1 });
    
    if (tasks.length === 0) {
      return res.status(200).json({
        optimizedTasks: [],
        suggestions: [
          {
            type: 'empty',
            message: '📝 Add some tasks to get AI-powered optimization suggestions!',
            demo: false
          }
        ],
        demo: false
      });
    }

    // Prepare task list for AI
    const taskList = tasks.map(task => ({
      name: task.name,
      priority: task.priority,
      category: task.category,
      completed: task.completed
    }));

    // Create AI prompt
    const prompt = `As a productivity expert, analyze these tasks and provide optimization:

Tasks:
${taskList.map((task, index) => `${index + 1}. ${task.name} (Priority: ${task.priority}, Category: ${task.category}, Completed: ${task.completed})`).join('\n')}

Please provide:
1. Reordered tasks by optimal priority
2. Specific next steps for each incomplete task
3. Efficiency suggestions

Format your response as JSON:
{
  "optimizedTasks": [
    {
      "originalIndex": 0,
      "name": "Task name",
      "priority": "high/medium/low",
      "category": "work/personal/shopping",
      "nextStep": "Specific actionable next step",
      "estimatedTime": "Time estimate in minutes"
    }
  ],
  "suggestions": [
    {
      "type": "priority/efficiency/motivation",
      "message": "Specific suggestion"
    }
  ]
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model
      messages: [
        {
          role: "system",
          content: "You are a productivity expert assistant. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Parse AI response
    let aiResponse;
    try {
      const content = completion.choices[0].message.content;
      // Clean up the response to ensure valid JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('AI Response Parse Error:', parseError);
      // Fallback response
      aiResponse = {
        optimizedTasks: taskList.filter(t => !t.completed).map((task, index) => ({
          originalIndex: index,
          name: task.name,
          priority: task.priority,
          category: task.category,
          nextStep: `Break down "${task.name}" into smaller, manageable steps`,
          estimatedTime: "30"
        })),
        suggestions: [
          {
            type: "priority",
            message: "Focus on high-priority tasks first for maximum impact"
          }
        ]
      };
    }

    return res.status(200).json({
      ...aiResponse,
      originalTasks: taskList,
      demo: false
    });

  } catch (error) {
    console.error('AI Optimization Error:', error);
    
    // Return fallback response
    return res.status(200).json({
      optimizedTasks: [],
      suggestions: [
        {
          type: 'error',
          message: '🤖 AI optimization temporarily unavailable. Try again later!',
          demo: false
        }
      ],
      demo: false,
      error: error.message
    });
  }
}
