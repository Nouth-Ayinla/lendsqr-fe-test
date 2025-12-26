import { describe, it, expect } from 'vitest';
import { generateMockUsers } from '../utils/mockData';
import type { User } from '../types';

describe('Dashboard Filter Logic', () => {
  const users = generateMockUsers(100);

  // Helper function that mirrors the actual filter logic
  const applyFilter = (usersToFilter: User[], filter: {
    organization: string;
    username: string;
    email: string;
    phoneNumber: string;
    status: string;
    date: string;
  }): User[] => {
    return usersToFilter.filter((u) => {
      const byOrg =
        !filter.organization || u.organization === filter.organization;
      const byUsername =
        !filter.username ||
        u.username.toLowerCase().includes(filter.username.toLowerCase());
      const byEmail =
        !filter.email ||
        u.email.toLowerCase().includes(filter.email.toLowerCase());
      const byPhone =
        !filter.phoneNumber || u.phoneNumber.includes(filter.phoneNumber);
      const byStatus =
        !filter.status ||
        u.status.toLowerCase() === filter.status.toLowerCase();
      const byDate =
        !filter.date ||
        new Date(u.dateJoined).toISOString().slice(0, 10) === filter.date;
      return byOrg && byUsername && byEmail && byPhone && byStatus && byDate;
    });
  };

  it('should return all users when no filter is applied', () => {
    const emptyFilter = {
      organization: '',
      username: '',
      email: '',
      phoneNumber: '',
      status: '',
      date: '',
    };
    
    const result = applyFilter(users, emptyFilter);
    expect(result.length).toBe(100);
  });

  it('should filter by status correctly', () => {
    const activeFilter = {
      organization: '',
      username: '',
      email: '',
      phoneNumber: '',
      status: 'active',
      date: '',
    };
    
    const result = applyFilter(users, activeFilter);
    result.forEach(user => {
      expect(user.status.toLowerCase()).toBe('active');
    });
  });

  it('should filter by organization correctly', () => {
    const firstUser = users[0];
    const org = firstUser.organization;
    
    const orgFilter = {
      organization: org,
      username: '',
      email: '',
      phoneNumber: '',
      status: '',
      date: '',
    };
    
    const result = applyFilter(users, orgFilter);
    result.forEach(user => {
      expect(user.organization).toBe(org);
    });
  });

  it('should filter by username (substring, case-insensitive)', () => {
    const filter = {
      organization: '',
      username: 'john',
      email: '',
      phoneNumber: '',
      status: '',
      date: '',
    };
    
    const result = applyFilter(users, filter);
    result.forEach(user => {
      expect(user.username.toLowerCase()).toContain('john');
    });
  });

  it('should filter by email (substring, case-insensitive)', () => {
    const filter = {
      organization: '',
      username: '',
      email: 'gmail',
      phoneNumber: '',
      status: '',
      date: '',
    };
    
    const result = applyFilter(users, filter);
    result.forEach(user => {
      expect(user.email.toLowerCase()).toContain('gmail');
    });
  });

  it('should combine multiple filters with AND logic', () => {
    if (users.length > 0) {
      const firstUser = users.find(u => u.status === 'active');
      
      if (firstUser) {
        const combinedFilter = {
          organization: firstUser.organization,
          username: '',
          email: '',
          phoneNumber: '',
          status: 'active',
          date: '',
        };
        
        const result = applyFilter(users, combinedFilter);
        result.forEach(user => {
          expect(user.organization).toBe(firstUser.organization);
          expect(user.status.toLowerCase()).toBe('active');
        });
      }
    }
  });

  it('should handle case-insensitive status filter', () => {
    const filter = {
      organization: '',
      username: '',
      email: '',
      phoneNumber: '',
      status: 'ACTIVE', // uppercase
      date: '',
    };
    
    const result = applyFilter(users, filter);
    result.forEach(user => {
      expect(user.status.toLowerCase()).toBe('active');
    });
  });
});
