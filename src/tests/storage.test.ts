import { describe, it, expect, beforeEach } from 'vitest';
import { storageUtils } from '../utils/storage';
import type { User } from '../types/index.js';

describe('Storage Utilities', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    phoneNumber: '08012345678',
    organization: 'Lendsqr',
    dateJoined: '2023-01-01',
    status: 'active',
    fullName: 'Test User',
    gender: 'Male',
    maritalStatus: 'Single',
    children: 'None',
    typeOfResidence: 'Own House',
    levelOfEducation: 'B.Sc',
    employmentStatus: 'Employed',
    sectorOfEmployment: 'FinTech',
    durationOfEmployment: '2 years',
    officeEmail: 'test@company.com',
    monthlyIncome: '₦200,000',
    loanRepayment: '₦50,000',
    socialMediaHandle: '@testuser',
    guarantorFullName: 'John Doe',
    guarantorPhoneNumber: '08087654321',
    guarantorEmail: 'john@example.com',
    guarantorRelationship: 'Friend',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveUsers and getUsers', () => {
    it('should save and retrieve users from localStorage', () => {
      const users = [mockUser];
      storageUtils.saveUsers(users);
      
      const retrievedUsers = storageUtils.getUsers();
      expect(retrievedUsers).toEqual(users);
    });

    it('should return null when no users are stored', () => {
      const users = storageUtils.getUsers();
      expect(users).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should retrieve a user by ID', () => {
      storageUtils.saveUsers([mockUser]);
      
      const user = storageUtils.getUserById('1');
      expect(user).toEqual(mockUser);
    });

    it('should return null for non-existent user', () => {
      storageUtils.saveUsers([mockUser]);
      
      const user = storageUtils.getUserById('999');
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      storageUtils.saveUsers([mockUser]);
      
      const updatedUser = { ...mockUser, status: 'inactive' as const };
      const result = storageUtils.updateUser(updatedUser);
      
      expect(result).toBe(true);
      
      const retrieved = storageUtils.getUserById('1');
      expect(retrieved?.status).toBe('inactive');
    });

    it('should return false for non-existent user', () => {
      storageUtils.saveUsers([mockUser]);
      
      const newUser = { ...mockUser, id: '999' };
      const result = storageUtils.updateUser(newUser);
      
      expect(result).toBe(false);
    });
  });

  describe('authentication', () => {
    it('should set and get auth token', () => {
      const token = 'test-token-123';
      storageUtils.setAuthToken(token);
      
      const retrievedToken = storageUtils.getAuthToken();
      expect(retrievedToken).toBe(token);
    });

    it('should remove auth token', () => {
      storageUtils.setAuthToken('test-token');
      storageUtils.removeAuthToken();
      
      const token = storageUtils.getAuthToken();
      expect(token).toBeNull();
    });
  });

  describe('current user', () => {
    it('should set and get current user', () => {
      const email = 'test@example.com';
      storageUtils.setCurrentUser(email);
      
      const currentUser = storageUtils.getCurrentUser();
      expect(currentUser).toBe(email);
    });

    it('should clear current user', () => {
      storageUtils.setCurrentUser('test@example.com');
      storageUtils.clearCurrentUser();
      
      const currentUser = storageUtils.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should clear all stored data', () => {
      storageUtils.saveUsers([mockUser]);
      storageUtils.setAuthToken('test-token');
      storageUtils.setCurrentUser('test@example.com');
      
      storageUtils.clearAll();
      
      expect(storageUtils.getUsers()).toBeNull();
      expect(storageUtils.getAuthToken()).toBeNull();
      expect(storageUtils.getCurrentUser()).toBeNull();
    });
  });
});
