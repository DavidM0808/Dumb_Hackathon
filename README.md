# Labubu Dating App 💕

An interactive dating simulation app featuring the adorable Labubu character. Users can interact with Labubu through heart reactions and audio controls in a fun, engaging interface.

## Features

- 🎯 Interactive Labubu character with video animations
- 🎬 Dynamic video switching based on heart count and mute state
- ❤️ Heart reaction system (heart/broken heart buttons)
- 🎧 Audio mute/unmute functionality with video-based earmuffs indicator
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
2. **Note**: The app starts with earmuffs active by default (muted state)
3. Interact with Labubu using the available controls:
   - **🎧 Earmuffs button**: Toggle audio mute/unmute (click to unmute first)
   - **❤️ Heart button**: Add a heart (like) - positioned on left ear, only works when unmuted
   - **💔 Broken Heart button**: Remove a heart (dislike) - positioned on right ear, only works when unmuted
4. Watch the heart counter and audio status update in real-time
5. **Dynamic Video Behavior**: The background video changes based on your heart count:
   - **3+ hearts**: Default happy Labubu animation
   - **2 hearts**: "Ewww disgusting" reaction video
   - **1 heart**: "Angry shot gun" reaction video  
   - **0 hearts**: "Crying" emotional video
6. When earmuffs are active, the video switches to show Labubu putting on earmuffs, and ear buttons are disabled
7. When unmuted, the video switches back to the heart-count appropriate animation

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
M
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
│   ├── labubu - standing still - default.mov  # Default Labubu video (3+ hearts)
│   ├── put on earmuff.mov                      # Earmuffs video (muted state)
│   ├── ewww disgusting.mov                     # Disgusted reaction (2 hearts)
│   ├── angry SHOT GUN.mov                      # Angry reaction (1 heart)
│   └── crying.mov                              # Crying reaction (0 hearts)
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
- **Default State**: The app starts with earmuffs active (muted) by default for a quieter initial experience
- **Dynamic Video System**: The main character uses video files that switch based on:
  - **Mute state**: Shows earmuffs video when muted
  - **Heart count**: Different emotional reactions based on remaining hearts (3+: happy, 2: disgusted, 1: angry, 0: crying)
- CORS is configured to allow requests from the frontend development server
- The frontend includes loading states and error handling for better UX
- All interactive elements are disabled during API calls to prevent race conditions
- The earmuffs feature switches between two video files and disables ear-related interactions
- Users must click the earmuffs button to unmute before they can interact with Labubu's ears
- Video files are served from the public directory and loop continuously

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