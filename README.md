# TaskForce Mobile – GPS Sales Tracker for Algerian Agencies

TaskForce Mobile is a mobile-first PWA for commercial teams in Algeria, providing GPS tracking for sales visits, offline sync, and AI-powered lead scoring.

- Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase
- Features GPS visit tracking, offline mode, and AI prospect scoring
- Designed as a lightweight alternative to traditional ERP and field sales solutions for Algerian agencies at 15$/month

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

"TaskForce Mobile is a production-ready GPS Sales Tracker PWA for Algerian agencies, featuring offline sync, AI lead scoring, and real-time visit tracking. Built with Next.js, Supabase, and PWA technology as a lightweight alternative to traditional ERP and field sales solutions at 15$/month."

**LinkedIn post snippet (you can adapt):**

"🚀 Just shipped TaskForce Mobile - GPS Sales Tracker for Algerian agencies!

After seeing how expensive traditional ERP solutions are (75$+/month), I built an alternative 5x cheaper:

✅ GPS tracking for each sales visit
✅ Offline mode (works without 4G)
✅ AI scoring for prospects (hot/warm/cold)
✅ PWA installable (no app store needed)
✅ Real-time team dashboard

🇩🇿 Built specifically for Algerian market:
- French interface (fr-DZ)
- WhatsApp support
- 15$/month vs traditional ERP's 75$+
- Works in areas with limited connectivity

Tech stack: Next.js 14 + Supabase + PWA + AI

Live demo: https://taskforce-mobile.vercel.app

Beta testers wanted! If you run a commercial agency in Algeria (Blida, Algiers, Oran), DM me for free access.

#Startups #Algeria #SaaS #SalesTech #PWA"

**LinkedIn DM template for agencies:**

"Salam! I noticed you're in the commercial space in Algeria. I've built TaskForce Mobile - a GPS sales tracker specifically for DZ agencies, 5x cheaper than traditional ERP solutions.

Would you be interested in a free beta test? Features:
- GPS visit tracking
- Offline sync (no 4G needed)
- AI prospect scoring
- 15$/month pricing

Happy to show you a quick demo. Ramadan Mubarak!"

**Email subject for agencies:**
"TaskForce Mobile - Alternative ERP 5x moins cher pour agences DZ"

---

**Built with ❤️ for the Algerian business community**
