# PaisaTrack - Personal Expense Tracker

A full-stack personal expense tracker built with React, Node.js, Express, and MongoDB.

## Features

- Google OAuth authentication via Firebase
- Monthly budget setup with customizable categories
- Add/delete expenses with category, note, and date
- Dashboard with spending summaries and budget health
- Interactive charts (Donut, Bar, Cumulative, Monthly)
- Transaction history with filtering
- Budget alerts and notifications
- Monthly calendar heatmap view
- Settings for budget and category management
- CSV export functionality
- Dark/Light theme toggle
- Mobile-responsive design

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: Firebase Google OAuth
- **Charts**: Custom SVG-based charts

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Firebase project with Google Auth enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:

   **Server** (`server/.env`):
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/paisatracker
   PORT=5000
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email@project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   ```

   **Client** (`client/.env`):
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Project Structure

```
/client          # React frontend
  /src
    /components  # Reusable UI components
    /pages       # Page components
    /hooks       # Custom React hooks
    /context     # React context providers
    /utils       # Utility functions
/server          # Express backend
  /routes        # API route handlers
  /models        # Mongoose models
  /middleware    # Express middleware
```

## API Endpoints

- `POST /api/expenses` - Add new expense
- `GET /api/expenses?month=2025-04` - Get expenses for month
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/budget` - Get user budget
- `POST /api/budget` - Update budget settings
- `GET /api/summary/:month` - Get monthly summary

## License

MIT
