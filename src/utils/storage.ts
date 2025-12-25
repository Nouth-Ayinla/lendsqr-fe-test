import type { User } from '../types/index.js';

const USERS_STORAGE_KEY = 'lendsqr_users';
const CURRENT_USER_KEY = 'lendsqr_current_user';
const AUTH_TOKEN_KEY = 'lendsqr_auth_token';

export const storageUtils = {
  // Users management
  saveUsers: (users: User[]): void => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  },

  getUsers: (): User[] | null => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : null;
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return null;
    }
  },

  getUserById: (id: string): User | null => {
    try {
      const users = storageUtils.getUsers();
      if (!users) return null;
      return users.find(user => user.id === id) || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },

  updateUser: (updatedUser: User): boolean => {
    try {
      const users = storageUtils.getUsers();
      if (!users) return false;
      
      const index = users.findIndex(user => user.id === updatedUser.id);
      if (index === -1) return false;
      
      users[index] = updatedUser;
      storageUtils.saveUsers(users);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  // Authentication
  setAuthToken: (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  removeAuthToken: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Current user session
  setCurrentUser: (email: string): void => {
    localStorage.setItem(CURRENT_USER_KEY, email);
  },

  getCurrentUser: (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  clearCurrentUser: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
