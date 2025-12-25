// Type definitions for the application

export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: 'active' | 'inactive' | 'pending' | 'blacklisted';
  fullName: string;
  bvn?: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
  levelOfEducation: string;
  employmentStatus: string;
  sectorOfEmployment: string;
  durationOfEmployment: string;
  officeEmail: string;
  monthlyIncome: string;
  loanRepayment: string;
  socialMediaHandle: string;
  guarantorFullName: string;
  guarantorPhoneNumber: string;
  guarantorEmail: string;
  guarantorRelationship: string;
  guarantor2FullName?: string;
  guarantor2PhoneNumber?: string;
  guarantor2Email?: string;
  guarantor2Relationship?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
}

export interface FilterParams {
  organization?: string;
  username?: string;
  email?: string;
  date?: string;
  phoneNumber?: string;
  status?: string;
}
