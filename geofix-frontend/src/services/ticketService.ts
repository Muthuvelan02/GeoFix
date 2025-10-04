import api from '@/lib/axios';

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
    phone?: string;
  };
  assignedWorker?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  proofOfWorkPhoto?: string;
  estimatedCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  completedAt?: string;
}

export interface TicketCreateRequest {
  title: string;
  description: string;
  location: string;
}

export interface TicketStats {
  total: number;
  pending: number;
  assignedToContractor: number;
  assignedToWorker: number;
  inProgress: number;
  completed: number;
  rejected: number;
}

class TicketService {
  // Create a new ticket
  async createTicket(ticketData: TicketCreateRequest, photos?: File[]): Promise<Ticket> {
    try {
      const formData = new FormData();
      
      // Add ticket data as JSON string
      formData.append('ticketData', JSON.stringify(ticketData));
      
      // Add photos if provided
      if (photos && photos.length > 0) {
        photos.forEach(photo => {
          formData.append('photos', photo);
        });
      }

      const response = await api.post<{ message: string; ticket: Ticket }>('/api/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data.ticket;
    } catch (error: any) {
      console.error('Create ticket error:', error);
      throw new Error(error.response?.data?.error || 'Failed to create ticket');
    }
  }

  // Get all tickets for the current citizen
  async getMyTickets(): Promise<Ticket[]> {
    try {
      const response = await api.get<Ticket[]>('/api/tickets/my-tickets');
      return response.data;
    } catch (error: any) {
      console.error('Get my tickets error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tickets');
    }
  }

  // Get a single ticket by ID
  async getTicketById(id: number): Promise<Ticket> {
    try {
      const response = await api.get<Ticket>(`/api/tickets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get ticket error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch ticket');
    }
  }

  // Get all tickets (admin only)
  async getAllTickets(): Promise<Ticket[]> {
    try {
      const response = await api.get<Ticket[]>('/api/tickets');
      return response.data;
    } catch (error: any) {
      console.error('Get all tickets error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tickets');
    }
  }

  // Calculate stats from tickets
  calculateStats(tickets: Ticket[]): TicketStats {
    return {
      total: tickets.length,
      pending: tickets.filter(t => t.status === 'PENDING').length,
      assignedToContractor: tickets.filter(t => t.status === 'ASSIGNED_TO_CONTRACTOR').length,
      assignedToWorker: tickets.filter(t => t.status === 'ASSIGNED_TO_WORKER').length,
      inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      completed: tickets.filter(t => t.status === 'COMPLETED').length,
      rejected: tickets.filter(t => t.status === 'REJECTED').length,
    };
  }

  // Helper method to get user-friendly status
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Pending',
      'ASSIGNED_TO_CONTRACTOR': 'Assigned to Contractor',
      'ASSIGNED_TO_WORKER': 'Assigned to Worker',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'REJECTED': 'Rejected'
    };
    return statusMap[status] || status;
  }

  // Helper method to get status color
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'ASSIGNED_TO_CONTRACTOR': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'ASSIGNED_TO_WORKER': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }

  // Format date to readable string
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  // Get ticket photo URL
  getPhotoUrl(photoPath: string): string {
    if (!photoPath) return '';
    // If it's already a full URL, return as is
    if (photoPath.startsWith('http')) return photoPath;
    // Otherwise, construct the URL with the backend base URL
    return `http://localhost:9050${photoPath}`;
  }
}

export const ticketService = new TicketService();
