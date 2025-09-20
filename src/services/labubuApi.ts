// API service for Labubu dating app

const API_BASE_URL = 'http://localhost:3001/api';

interface GameState {
  hearts: number;
  isMuted: boolean;
  lastUpdated: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class LabubuApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Get current game state
  async getGameState(): Promise<ApiResponse<GameState>> {
    return this.request<GameState>('/labubu/state');
  }

  // Add a heart
  async addHeart(): Promise<ApiResponse<GameState>> {
    return this.request<GameState>('/labubu/hearts/add', {
      method: 'POST',
    });
  }

  // Remove a heart
  async removeHeart(): Promise<ApiResponse<GameState>> {
    return this.request<GameState>('/labubu/hearts/remove', {
      method: 'POST',
    });
  }

  // Toggle audio mute state
  async toggleAudio(): Promise<ApiResponse<GameState>> {
    return this.request<GameState>('/labubu/audio/toggle', {
      method: 'POST',
    });
  }

  // Update entire game state
  async updateGameState(hearts: number, isMuted: boolean): Promise<ApiResponse<GameState>> {
    return this.request<GameState>('/labubu/state', {
      method: 'PUT',
      body: JSON.stringify({ hearts, isMuted }),
    });
  }

  // Reset game state
  async resetGameState(): Promise<ApiResponse<GameState>> {
    return this.request<GameState>('/labubu/reset', {
      method: 'POST',
    });
  }
}

export const labubuApi = new LabubuApiService();
export type { GameState, ApiResponse };