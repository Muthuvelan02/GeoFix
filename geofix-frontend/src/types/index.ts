// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  roles: string[];
  status: string;
}

// Ticket Types
export interface Ticket {
  id: number;
  title: string;
  description: string;
  location: string;
  photos?: string[];
  status: 'PENDING' | 'ASSIGNED_TO_CONTRACTOR' | 'ASSIGNED_TO_WORKER' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  citizen: {
    id: number;
    name: string;
    email: string;
    mobile?: string;
  };
  assignedContractor?: {
    id: number;
    name: string;
    email: string;
  };
  assignedWorker?: {
    id: number;
    name: string;
    email: string;
  };
  proofOfWorkPhoto?: string;
  estimatedCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  completedAt?: string;
}

// Worker Types
export interface Worker {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: string;
  roles: string[];
  contractor?: {
    id: number;
    name: string;
    email: string;
  };
}

// Auth Types
export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  roles: string[];
}

export interface SignupRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
  address: string;
  role: 'ROLE_CITIZEN' | 'ROLE_CONTRACTOR' | 'ROLE_ADMIN';
}
