import type { User, DashboardStats } from '../types/index.js';
import { mockUsers } from '../utils/mockData';
import { storageUtils } from '../utils/storage';

// Simulates API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Get all users (simulates API call)
  getUsers: async (): Promise<User[]> => {
    await delay(500); // Simulate network delay
    
    // Check if users exist in local storage
    let users = storageUtils.getUsers();
    
    // If not, use mock data and save to local storage
    if (!users) {
      users = mockUsers;
      storageUtils.saveUsers(users);
    }
    
    return users;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    await delay(300);
    return storageUtils.getUserById(id);
  },

  // Update user
  updateUser: async (user: User): Promise<boolean> => {
    await delay(300);
    return storageUtils.updateUser(user);
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(300);
    const users = await api.getUsers();
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      usersWithLoans: Math.floor(users.length * 0.45), // Mock data
      usersWithSavings: Math.floor(users.length * 0.38), // Mock data
    };
  },

  // Login simulation
  login: async (email: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> => {
    await delay(500);
    
    // Simple validation (for demo purposes)
    if (email && password.length >= 6) {
      const token = btoa(`${email}:${Date.now()}`); // Simple token generation
      storageUtils.setAuthToken(token);
      storageUtils.setCurrentUser(email);
      return { success: true, token };
    }
    
    return { success: false, message: 'Invalid credentials' };
  },

  // Logout
  logout: async (): Promise<void> => {
    await delay(200);
    storageUtils.removeAuthToken();
    storageUtils.clearCurrentUser();
  },

  // Check authentication
  isAuthenticated: (): boolean => {
    return !!storageUtils.getAuthToken();
  },
};
