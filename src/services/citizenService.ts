import api from '@/lib/axios';

// ==================== TYPES ====================

export interface CitizenTicket {
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
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  completedAt?: string;
  proofOfWorkPhoto?: string;
}

export interface TicketCreateRequest {
  title: string;
  description: string;
  location: string;
}

export interface CitizenStats {
  totalTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  completedTickets: number;
  rejectedTickets: number;
}

// ==================== SERVICE CLASS ====================

class CitizenService {
  
  // ==================== TICKET MANAGEMENT ====================
  
  /**
   * Create a new ticket
   */
  async createTicket(ticketData: TicketCreateRequest, photos?: File[]): Promise<CitizenTicket> {
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

      const response = await api.post<{ message: string; ticket: CitizenTicket }>('/api/tickets', formData, {
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

  /**
   * Get all tickets for the current citizen
   */
  async getMyTickets(): Promise<CitizenTicket[]> {
    try {
      const response = await api.get<CitizenTicket[]>('/api/tickets/my-tickets');
      return response.data;
    } catch (error: any) {
      console.error('Get my tickets error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tickets');
    }
  }

  /**
   * Get a single ticket by ID
   */
  async getTicketById(id: number): Promise<CitizenTicket> {
    try {
      const response = await api.get<CitizenTicket>(`/api/tickets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get ticket error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch ticket');
    }
  }

  // ==================== STATISTICS & ANALYTICS ====================
  
  /**
   * Get citizen statistics
   */
  async getCitizenStats(): Promise<CitizenStats> {
    try {
      const tickets = await this.getMyTickets();
      
      return {
        totalTickets: tickets.length,
        pendingTickets: tickets.filter(t => t.status === 'PENDING').length,
        inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        completedTickets: tickets.filter(t => t.status === 'COMPLETED').length,
        rejectedTickets: tickets.filter(t => t.status === 'REJECTED').length,
      };
    } catch (error: any) {
      console.error('Error fetching citizen stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch citizen statistics');
    }
  }

  // ==================== HELPER METHODS ====================
  
  /**
   * Calculate stats from tickets
   */
  calculateStats(tickets: CitizenTicket[]): CitizenStats {
    return {
      totalTickets: tickets.length,
      pendingTickets: tickets.filter(t => t.status === 'PENDING').length,
      inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      completedTickets: tickets.filter(t => t.status === 'COMPLETED').length,
      rejectedTickets: tickets.filter(t => t.status === 'REJECTED').length,
    };
  }

  /**
   * Get user-friendly status label
   */
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

  /**
   * Get status color for badges
   */
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

  /**
   * Format date to readable string
   */
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

  /**
   * Get ticket photo URL
   */
  getPhotoUrl(photoPath: string): string {
    if (!photoPath) return '';
    // If it's already a full URL, return as is
    if (photoPath.startsWith('http')) return photoPath;
    // Otherwise, construct the URL with the backend base URL
    return `http://localhost:9050${photoPath}`;
  }
}

// Export singleton instance
const citizenService = new CitizenService();
export default citizenService;
