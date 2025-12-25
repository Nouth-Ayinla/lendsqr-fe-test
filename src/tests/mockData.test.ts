import { describe, it, expect } from 'vitest';
import { generateMockUsers } from '../utils/mockData';

describe('Mock Data Generator', () => {
  it('should generate the correct number of users', () => {
    const users = generateMockUsers(100);
    expect(users).toHaveLength(100);
  });

  it('should generate users with all required fields', () => {
    const users = generateMockUsers(10);
    
    users.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('phoneNumber');
      expect(user).toHaveProperty('organization');
      expect(user).toHaveProperty('status');
      expect(user).toHaveProperty('fullName');
    });
  });

  it('should generate users with valid email format', () => {
    const users = generateMockUsers(10);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    users.forEach(user => {
      expect(user.email).toMatch(emailRegex);
    });
  });

  it('should generate users with valid status values', () => {
    const users = generateMockUsers(50);
    const validStatuses = ['active', 'inactive', 'pending', 'blacklisted'];
    
    users.forEach(user => {
      expect(validStatuses).toContain(user.status);
    });
  });

  it('should generate unique user IDs', () => {
    const users = generateMockUsers(100);
    const ids = users.map(u => u.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(users.length);
  });
});
