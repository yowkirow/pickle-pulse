# Pickle-Pulse 🥒⚡

A futuristic, high-performance tournament management system for Pickleball.

## 🚀 Getting Started

### 1. Database Setup (Supabase)
1.  Create a new project at [supabase.com](https://supabase.com).
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy and paste the contents of `supabase/migrations/20260209_initial_schema.sql` and run it.
4.  Copy your **Project URL** and **Anon Key** from Project Settings > API.

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

## 🏗️ Architecture
- **Theme**: "Center Court" (Volt Yellow & Deep Slate).
- **Stack**: React + Vite + Tailwind + Supabase.
- **Features**: Smart Autopilot Scheduling, Real-time Pulse Scoring.
