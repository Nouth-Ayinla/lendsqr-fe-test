import type { User } from '../types/index.js';

const organizations = ['Lendsqr', 'Irorun', 'Lendstar', 'LAPO', 'Fairmoney', 'Kuda', 'Sterling Bank', 'GTBank'];
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Daniel', 'Rachel', 'James', 'Mary', 'Robert', 'Patricia', 'William', 'Jennifer', 'Richard', 'Elizabeth', 'Thomas', 'Linda'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const statuses: Array<'active' | 'inactive' | 'pending' | 'blacklisted'> = ['active', 'inactive', 'pending', 'blacklisted'];
const genders = ['Male', 'Female'];
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
const residences = ['Parent\'s Apartment', 'Own House', 'Rented Apartment', 'Company Apartment'];
const educationLevels = ['B.Sc', 'M.Sc', 'PhD', 'HND', 'OND', 'SSCE'];
const employmentStatuses = ['Employed', 'Self-employed', 'Unemployed', 'Student'];
const sectors = ['FinTech', 'Healthcare', 'Education', 'Retail', 'Technology', 'Agriculture', 'Manufacturing', 'Transportation'];

function generatePhoneNumber(): string {
  return `080${Math.floor(10000000 + Math.random() * 90000000)}`;
}

function generateEmail(firstName: string, lastName: string): string {
  const providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'lendsqr.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${providers[Math.floor(Math.random() * providers.length)]}`;
}

function generateDate(): string {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateMonthlyIncome(): string {
  const min = 50000;
  const max = 5000000;
  return `₦${(Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString()} - ₦${(Math.floor(Math.random() * (max - min + 1)) + min + 100000).toLocaleString()}`;
}

function generateLoanRepayment(): string {
  const amount = Math.floor(Math.random() * 500000) + 10000;
  return `₦${amount.toLocaleString()}`;
}

export function generateMockUsers(count: number = 500): User[] {
  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;

    users.push({
      id: `${i}`,
      organization: organizations[Math.floor(Math.random() * organizations.length)],
      username,
      email: generateEmail(firstName, lastName),
      phoneNumber: generatePhoneNumber(),
      dateJoined: generateDate(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      fullName,
      bvn: `070${Math.floor(10000000 + Math.random() * 90000000)}`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
      children: Math.random() > 0.5 ? `${Math.floor(Math.random() * 5)}` : 'None',
      typeOfResidence: residences[Math.floor(Math.random() * residences.length)],
      levelOfEducation: educationLevels[Math.floor(Math.random() * educationLevels.length)],
      employmentStatus: employmentStatuses[Math.floor(Math.random() * employmentStatuses.length)],
      sectorOfEmployment: sectors[Math.floor(Math.random() * sectors.length)],
      durationOfEmployment: `${Math.floor(Math.random() * 20) + 1} years`,
      officeEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      monthlyIncome: generateMonthlyIncome(),
      loanRepayment: generateLoanRepayment(),
      socialMediaHandle: `@${username}`,
      guarantorFullName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      guarantorPhoneNumber: generatePhoneNumber(),
      guarantorEmail: generateEmail(firstNames[Math.floor(Math.random() * firstNames.length)], lastNames[Math.floor(Math.random() * lastNames.length)]),
      guarantorRelationship: ['Father', 'Mother', 'Brother', 'Sister', 'Friend', 'Colleague'][Math.floor(Math.random() * 6)],
      guarantor2FullName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      guarantor2PhoneNumber: generatePhoneNumber(),
      guarantor2Email: generateEmail(firstNames[Math.floor(Math.random() * firstNames.length)], lastNames[Math.floor(Math.random() * lastNames.length)]),
      guarantor2Relationship: ['Father', 'Mother', 'Brother', 'Sister', 'Friend', 'Colleague'][Math.floor(Math.random() * 6)],
    });
  }

  return users;
}

export const mockUsers = generateMockUsers(500);
