# UniAsset Tracker

A comprehensive university asset management system built with modern web technologies. Track, manage, and maintain university assets across departments with real-time monitoring and reporting capabilities.

## Features

- **Asset Management**: Create, update, and track university assets with detailed information
- **Department Organization**: Organize assets by departments and locations
- **Maintenance Tracking**: Schedule and monitor asset maintenance activities
- **Reporting & Analytics**: Generate comprehensive reports and visualizations
- **User Authentication**: Secure access with Supabase authentication
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Authentication)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uniasset-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Verify Environment**
   ```bash
   npm run verify-env
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run verify-env` - Verify environment variables

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions and configurations
├── pages/              # Application pages/routes
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Database Setup

The application uses Supabase as the backend. Make sure to:

1. Create a new Supabase project
2. Set up the required database tables (refer to `supabase/` directory for migrations)
3. Configure Row Level Security (RLS) policies
4. Add your Supabase URL and anon key to environment variables

## Authentication

The application includes:
- User registration and login
- Protected routes
- Session management
- Role-based access control

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Manual Deployment

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Configure environment variables on your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository or contact the development team.