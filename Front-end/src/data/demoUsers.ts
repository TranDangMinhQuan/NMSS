import type { Account } from '../types';

export const demoUsers: Record<string, Account> = {
  'admin': {
    account_id: '1',
    username: 'admin',
    email: 'admin@nvh.edu.vn',
    phone: '0123456789',
    role: 'admin',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  'staff': {
    account_id: '2',
    username: 'staff',
    email: 'staff@nvh.edu.vn',
    phone: '0987654321',
    role: 'staff',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  'member': {
    account_id: '3',
    username: 'member',
    email: 'member@nvh.edu.vn',
    phone: '0369852147',
    role: 'member',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }
};

export const demoPassword = 'password';
