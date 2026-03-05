# TaskForce Mobile – GPS Sales Tracker for Algerian Agencies

TaskForce Mobile is a mobile-first PWA for commercial teams in Algeria, providing GPS tracking for sales visits, offline sync, and AI-powered lead scoring.

- Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase
- Features GPS visit tracking, offline mode, and AI prospect scoring
- Designed as a Silwane competitor for Algerian agencies at 15$/month

## Live Demo

- Landing page: https://taskforce-mobile.vercel.app
- Mobile dashboard: /working-app

## Key Features

- GPS tracking for each commercial visit
- Offline mode with automatic sync
- AI scoring for prospects (hot/warm/cold)
- Real-time team dashboard
- Export reports compliant with Algerian standards

## Tech Stack

- Framework: Next.js (App Router), TypeScript
- UI: Tailwind CSS, mobile-first PWA design
- Database: Supabase (PostgreSQL)
- Auth: Clerk (optional, environment-driven)
- AI: OpenAI API for lead scoring
- Hosting: Vercel

## Project Structure

```
task-manager-frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── working-app/       # Protected dashboard
│   ├── sign-in/           # Authentication pages
│   └── api/               # API routes
├── src/components/        # Reusable components
├── public/               # Static assets
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database (optional for full functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Abdessalem2000/task-manager-frontend.git
cd task-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Clerk Authentication (optional)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Database
MONGODB_URI=mongodb+srv://...

# OpenAI (for AI features)
OPENAI_API_KEY=sk_openai_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/working-app`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/working-app`
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key for AI features

## Features Overview

### 🏠 Landing Page
- Professional B2B SaaS design
- Feature highlights and benefits
- Call-to-action for sign-up
- Responsive layout

### 🔐 Authentication
- Clerk-powered authentication
- Sign-in and sign-up flows
- Protected routes
- Environment-based enablement

### 📊 Analytics Dashboard
- Task completion metrics
- Habit tracking visualization
- KPI cards and progress indicators
- Dark theme SaaS interface

### 🎯 Task Management
- Create, edit, and delete tasks
- Priority levels and categories
- Completion tracking
- Weekly goal setting

### 🔄 Habit Tracking
- Daily habit logging
- Streak tracking
- Progress visualization
- Routine management

## API Endpoints

The application includes several API routes for data management:

- `GET/POST /api/tasks` - Task CRUD operations
- `GET/POST /api/habits` - Habit management
- `POST /api/ai/optimize` - AI-powered task optimization
- `GET /api/ping` - Health check endpoint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Portfolio Use

This project is designed to be a portfolio-ready SaaS application showcasing:

- **Modern Development**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication Integration**: Clerk implementation
- **Database Integration**: MongoDB with Mongoose
- **API Design**: RESTful API routes
- **UI/UX Design**: Professional SaaS interface
- **Production Deployment**: Vercel hosting

Perfect for developers looking to demonstrate full-stack development skills with a real-world SaaS application.

## Support

For questions or support, please open an issue in the GitHub repository or contact the project maintainer.

## LinkedIn / Portfolio Snippets

**Short project description (for portfolio / GitHub):**

"TaskMetrics is a production-ready Next.js SaaS template that combines tasks, habits, and AI insights into a single analytics dashboard. It includes a full marketing landing page, auth-ready routing, and a dark SaaS UI optimized for teams and agencies."

**LinkedIn post snippet (you can adapt):**

"I've just shipped TaskMetrics – a modern task & habit analytics dashboard built with Next.js, TypeScript, Tailwind, Clerk, and MongoDB.

It's structured like a real SaaS: public landing page, auth routes, and a protected dashboard that shows tasks, completion rate, weekly goals, and room for AI insights.

If you run a small team or agency and want a lightweight analytics view of what's actually getting done each week, I can customize this dashboard for your workflow."

---

**Built with ❤️ for the modern development community**
