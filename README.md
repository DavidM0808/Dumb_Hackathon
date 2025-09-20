# Labubu Dating App 💕

An interactive dating simulation app featuring the adorable Labubu character. Users can interact with Labubu through heart reactions and audio controls in a fun, engaging interface.

## Features

- 🎯 Interactive Labubu character with SVG animations
- ❤️ Heart reaction system (like/dislike)
- 🎧 Audio mute/unmute functionality with earmuffs visual indicator
- 📱 Responsive design with modern UI
- 🔄 Real-time state synchronization between frontend and backend
- ⚡ Loading states and error handling
- 🎨 Smooth animations and transitions

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.20.2 or higher)
- **npm** (comes with Node.js)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /path/to/Dumb_Hackathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

This application consists of both a frontend (React + Vite) and backend (Express.js) that need to run simultaneously.

### Option 1: Run Both Servers Concurrently (Recommended)

```bash
npm run dev
```

This command will start both the frontend and backend servers:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Option 2: Run Servers Separately

**Terminal 1 - Start the backend server:**
```bash
npm run server:dev
```
Backend will be available at: http://localhost:3001

**Terminal 2 - Start the frontend development server:**
```bash
npm run client:dev
```
Frontend will be available at: http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Interact with Labubu using the available controls:
   - **❤️ Check button**: Add a heart (like)
   - **❌ Cross button**: Remove a heart (dislike)
   - **🎧 Earmuffs button**: Toggle audio mute/unmute
3. Watch the heart counter and audio status update in real-time
4. When earmuffs are active, the ear buttons are disabled

## API Endpoints

The backend provides the following REST API endpoints:

### Game State Management
- `GET /api/labubu/state` - Get current game state
- `POST /api/labubu/hearts` - Add a heart
- `DELETE /api/labubu/hearts` - Remove a heart
- `PUT /api/labubu/audio` - Toggle audio mute status
- `PUT /api/labubu/state` - Update entire game state
- `POST /api/labubu/reset` - Reset game to initial state

### Health Check
- `GET /api/health` - Check API health status

## Project Structure

```
Dumb_Hackathon/
├── api/                    # Backend Express.js application
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   └── routes/
│       └── labubu.ts      # Labubu game API routes
├── src/                   # Frontend React application
│   ├── components/
│   │   └── LabubuDatingApp.tsx  # Main Labubu component
│   ├── pages/
│   │   └── Home.tsx       # Home page component
│   ├── services/
│   │   └── labubuApi.ts   # API service layer
│   └── App.tsx           # Main React app component
├── public/               # Static assets
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## Available Scripts

- `npm run dev` - Run both frontend and backend concurrently
- `npm run client:dev` - Run frontend development server only
- `npm run server:dev` - Run backend development server only
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run check` - Run TypeScript type checking

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **Express.js** with TypeScript
- **CORS** for cross-origin requests
- **Nodemon** for development auto-restart

## Development Notes

- The application uses in-memory storage for game state (resets on server restart)
- CORS is configured to allow requests from the frontend development server
- The frontend includes loading states and error handling for better UX
- All interactive elements are disabled during API calls to prevent race conditions
- The earmuffs feature visually indicates when audio is muted and disables ear-related interactions

## Troubleshooting

**Port conflicts:**
- If port 5173 or 3001 is already in use, you can modify the ports in the respective configuration files
- Frontend port can be changed in `vite.config.ts`
- Backend port can be changed in `api/server.ts`

**Dependencies issues:**
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**API connection issues:**
- Ensure both frontend and backend servers are running
- Check that the API base URL in `src/services/labubuApi.ts` matches your backend server URL

## Future Enhancements

- Persistent data storage (database integration)
- User authentication and profiles
- AI voice agent integration
- Multiple Labubu characters
- Social features and sharing
- Mobile app version

---

**Happy dating with Labubu! 💕**