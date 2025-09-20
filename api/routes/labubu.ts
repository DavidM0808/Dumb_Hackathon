import express, { type Request, type Response } from 'express';

const router = express.Router();

// In-memory storage for demo purposes
// In a real app, you'd use a database
let gameState = {
  hearts: 3,
  isMuted: false,
  lastUpdated: new Date().toISOString()
};

/**
 * GET /api/labubu/state
 * Get current game state
 */
router.get('/state', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: gameState
  });
});

/**
 * POST /api/labubu/hearts/add
 * Add a heart (max 6)
 */
router.post('/hearts/add', (req: Request, res: Response) => {
  if (gameState.hearts < 6) {
    gameState.hearts += 1;
    gameState.lastUpdated = new Date().toISOString();
    
    res.json({
      success: true,
      data: gameState,
      message: 'Heart added successfully'
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Maximum hearts reached (6)'
    });
  }
});

/**
 * POST /api/labubu/hearts/remove
 * Remove a heart (min 0)
 */
router.post('/hearts/remove', (req: Request, res: Response) => {
  if (gameState.hearts > 0) {
    gameState.hearts -= 1;
    gameState.lastUpdated = new Date().toISOString();
    
    res.json({
      success: true,
      data: gameState,
      message: 'Heart removed successfully'
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Minimum hearts reached (0)'
    });
  }
});

/**
 * POST /api/labubu/audio/toggle
 * Toggle audio mute state
 */
router.post('/audio/toggle', (req: Request, res: Response) => {
  gameState.isMuted = !gameState.isMuted;
  gameState.lastUpdated = new Date().toISOString();
  
  res.json({
    success: true,
    data: gameState,
    message: `Audio ${gameState.isMuted ? 'muted' : 'unmuted'} successfully`
  });
});

/**
 * PUT /api/labubu/state
 * Update entire game state
 */
router.put('/state', (req: Request, res: Response) => {
  const { hearts, isMuted } = req.body;
  
  // Validate hearts range
  if (hearts !== undefined && (hearts < 0 || hearts > 6)) {
    return res.status(400).json({
      success: false,
      error: 'Hearts must be between 0 and 6'
    });
  }
  
  // Update state
  if (hearts !== undefined) gameState.hearts = hearts;
  if (isMuted !== undefined) gameState.isMuted = isMuted;
  gameState.lastUpdated = new Date().toISOString();
  
  res.json({
    success: true,
    data: gameState,
    message: 'Game state updated successfully'
  });
});

/**
 * POST /api/labubu/reset
 * Reset game state to default
 */
router.post('/reset', (req: Request, res: Response) => {
  gameState = {
    hearts: 3,
    isMuted: false,
    lastUpdated: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: gameState,
    message: 'Game state reset successfully'
  });
});

export default router;