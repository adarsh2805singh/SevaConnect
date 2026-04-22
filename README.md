# SevaConnect

SevaConnect is a volunteer management platform connecting NGOs and volunteers. The repository includes a Node.js + Express backend and a React + Vite frontend.

## Project Structure

- `Backend/` - Express API server, MongoDB integration, authentication, NGO and volunteer routes.
- `Frontend/` - React application built with Vite, routing, and UI for NGOs and volunteers.
- `PROJECT_STATUS.md` - project status and progress notes.
- `QUICK_START_DATABASE.md` - database setup guidance.
- `TESTING_GUIDE.md` - testing instructions.

## Key Features

- User authentication for NGOs and volunteers
- Task posting and volunteer application flows
- NGO and volunteer profile management
- MongoDB data persistence
- React-based dashboard and views for both user roles

## Getting Started

### Prerequisites

- Node.js (recommended v18+)
- npm
- MongoDB running locally or a MongoDB Atlas connection

### Root Setup

From the repository root, install dependencies separately in each folder.

```bash
cd Backend
npm install

cd ..\Frontend
npm install
```

## Backend

### Available Scripts

From `Backend/`:

```bash
npm run dev
```

This starts the backend with `nodemon` on `http://localhost:3001` by default.

### Environment Variables

Create a `.env` file in `Backend/` with:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sevaconnect
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
```

If `MONGODB_URI` is not provided, the backend will default to `mongodb://localhost:27017/sevaconnect`.

### Important Backend Files

- `Backend/server.js` - main Express server
- `Backend/config/database.js` - MongoDB connection
- `Backend/routes/` - auth, NGO, volunteer routes
- `Backend/controllers/` - request handlers and business logic
- `Backend/models/` - Mongoose schemas for User, NGO, Volunteer, Task
- `Backend/middleware/auth.js` - JWT authentication middleware

## Frontend

### Available Scripts

From `Frontend/`:

```bash
npm run dev
```

This starts the React app in development mode using Vite.

### Important Frontend Files

- `Frontend/src/main.jsx` - app entry point
- `Frontend/src/App.jsx` - application shell and routes
- `Frontend/src/pages/` - page components for landing, auth, NGO, volunteer, admin
- `Frontend/src/components/` - reusable UI components
- `Frontend/src/services/api.js` - API client and backend integration

## Documentation

The repository contains additional documentation and guides:

- `Backend/README.md` - backend documentation index and implementation notes
- `PROJECT_STATUS.md` - project status and milestones
- `QUICK_START_DATABASE.md` - database setup and configuration
- `TESTING_GUIDE.md` - test recommendations and procedures

## Running the Full App

1. Start MongoDB.
2. Start the backend in `Backend/`:

```bash
npm run dev
```

3. Start the frontend in `Frontend/`:

```bash
npm run dev
```

4. Open the frontend URL shown by Vite in your browser.

## Notes

- The backend exposes routes under `/api/auth`, `/api/volunteers`, and `/api/ngos`.
- The root backend server provides basic health and test endpoints:
  - `GET /health`
  - `GET /api/test`

## Contributing

Feel free to open issues or add features in the existing `Backend/` and `Frontend/` folders. Follow the structure and naming conventions already present in the repository.
