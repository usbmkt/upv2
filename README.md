# Launch Management System

A comprehensive system for managing product launches and events.

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A Supabase account and project

### Getting Started

1. Double-click the `deploy-local.bat` file or run it from the command line:
   ```bash
   ./deploy-local.bat
   ```

2. When prompted, update the `.env` file with your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. The development server will start automatically at http://localhost:5173

### Manual Setup

If you prefer to set up manually:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- Project timeline management
- Launch phase calculator
- Real-time updates
- Data persistence with Supabase
- User authentication
- Dark mode support

## Database Schema

The application uses Supabase with the following tables:
- `users`: User accounts and authentication
- `projects`: Launch projects and their details
- `phases`: Project phases and timelines

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request