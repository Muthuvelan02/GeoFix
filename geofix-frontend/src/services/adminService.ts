import api from '@/lib/axios';

// ==================== TYPES ====================

export interface Contractor {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  roles: string[];
  photoUrl?: string;
  aadharFrontUrl?: string;
  aadharBackUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  role: string[];
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  photoUrl?: string;
  createdAt: string;
  contractor?: {
    id: number;
    name: string;
  };
  ticketsCreated?: number;
  ticketsCompleted?: number;
  companyName?: string;
  specialization?: string;
}

export interface TicketForAdmin {
  id: number;
  title: string;
  description: string;
  location: string;
  photos?: string[];
  status: 'PENDING' | 'ASSIGNED_TO_CONTRACTOR' | 'ASSIGNED_TO_WORKER' | 'IN_PROGRESS' | 'COMPLETED';
  citizen: {
    id: number;
    name: string;
    email: string;
    mobile: string;
  };
  assignedContractor?: {
    id: number;
    name: string;
    email: string;
  };
  assignedWorker?: {
    id: number;
    name: string;
  };
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
  proofOfWorkPhoto?: string;
}

export interface DashboardStats {
  pendingTickets: number;
  verifiedContractors: number;
  totalTickets?: number;
  activeContractors?: number;
  totalWorkers?: number;
  completedTickets?: number;
}

export interface ReportData {
  resolvedTickets: number;
  unresolvedTickets: number;
  dateRange: string;
}

// ==================== SERVICE CLASS ====================

class AdminService {
  
  // ==================== CONTRACTOR MANAGEMENT ====================
  
  /**
   * Get all pending contractors for verification
   */
  async getPendingContractors(): Promise<Contractor[]> {
    try {
      const response = await api.get<Contractor[]>('/api/admin/contractors/pending');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending contractors:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch pending contractors');
    }
  }

  /**
   * Verify or reject a contractor
   */
  async verifyContractor(contractorId: number, status: 'VERIFIED' | 'REJECTED'): Promise<void> {
    try {
      await api.put(`/api/admin/contractors/${contractorId}/verify`, { status });
    } catch (error: any) {
      console.error('Error verifying contractor:', error);
      throw new Error(error.response?.data?.error || 'Failed to verify contractor');
    }
  }

  /**
   * Get all contractors (for user management page)
   */
  async getAllContractors(): Promise<AdminUser[]> {
    try {
      // Backend doesn't have this endpoint, we'll filter from getAllUsers
      const users = await this.getAllUsers();
      return users.filter(user => user.role.includes('ROLE_CONTRACTOR'));
    } catch (error: any) {
      console.error('Error fetching contractors:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch contractors');
    }
  }

  // ==================== TICKET MANAGEMENT ====================
  
  /**
   * Get all tickets (for admin dashboard)
   */
  async getAllTickets(): Promise<TicketForAdmin[]> {
    try {
      const response = await api.get<TicketForAdmin[]>('/api/tickets');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tickets');
    }
  }

  /**
   * Get tickets assigned to contractors
   */
  async getAssignedTickets(): Promise<TicketForAdmin[]> {
    try {
      const response = await api.get<TicketForAdmin[]>('/api/admin/tickets/assigned');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching assigned tickets:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch assigned tickets');
    }
  }

  /**
   * Assign ticket to contractor
   */
  async assignTicketToContractor(ticketId: number, contractorId: number): Promise<void> {
    try {
      await api.put(`/api/tickets/${ticketId}/assign-contractor/${contractorId}`);
    } catch (error: any) {
      console.error('Error assigning ticket:', error);
      throw new Error(error.response?.data?.error || 'Failed to assign ticket to contractor');
    }
  }

  // ==================== USER MANAGEMENT ====================
  
  /**
   * Get all users (this endpoint doesn't exist in backend, need to implement workaround)
   */
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      // Since backend doesn't have a getAllUsers endpoint,
      // we'll need to aggregate from different sources
      // For now, return mock data with proper structure
      // TODO: Add this endpoint to backend or fetch from multiple endpoints
      
      // Temporary implementation - fetch tickets to get users
      const tickets = await this.getAllTickets();
      const contractors = await this.getPendingContractors();
      
      // Extract unique users from tickets
      const usersMap = new Map<number, AdminUser>();
      
      // Add citizens from tickets
      tickets.forEach(ticket => {
        if (!usersMap.has(ticket.citizen.id)) {
          usersMap.set(ticket.citizen.id, {
            id: ticket.citizen.id,
            name: ticket.citizen.name,
            email: ticket.citizen.email,
            mobile: ticket.citizen.mobile,
            role: ['ROLE_CITIZEN'],
            status: 'ACTIVE',
            createdAt: ticket.createdAt,
          });
        }
      });
      
      // Add contractors
      contractors.forEach(contractor => {
        usersMap.set(contractor.id, {
          id: contractor.id,
          name: contractor.name,
          email: contractor.email,
          mobile: contractor.mobile,
          address: contractor.address,
          role: contractor.roles,
          status: contractor.status,
          photoUrl: contractor.photoUrl,
          createdAt: contractor.createdAt,
        });
      });
      
      return Array.from(usersMap.values());
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: number): Promise<void> {
    try {
      // Backend doesn't have this endpoint yet
      // TODO: Add this endpoint to backend
      // For now, simulate the call
      console.warn('Suspend user endpoint not implemented in backend yet');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error('Error suspending user:', error);
      throw new Error(error.response?.data?.error || 'Failed to suspend user');
    }
  }

  /**
   * Activate a suspended user
   */
  async activateUser(userId: number): Promise<void> {
    try {
      // Backend doesn't have this endpoint yet
      // TODO: Add this endpoint to backend
      console.warn('Activate user endpoint not implemented in backend yet');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error('Error activating user:', error);
      throw new Error(error.response?.data?.error || 'Failed to activate user');
    }
  }

  // ==================== DASHBOARD & ANALYTICS ====================
  
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>('/api/admin/dashboard');
      
      // Enhance with additional stats if needed
      const tickets = await this.getAllTickets();
      const completedCount = tickets.filter(t => t.status === 'COMPLETED').length;
      const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
      
      return {
        ...response.data,
        totalTickets: tickets.length,
        completedTickets: completedCount,
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard statistics');
    }
  }

  /**
   * Generate reports for a date range
   */
  async generateReport(dateRange: string): Promise<ReportData> {
    try {
      const response = await api.get<ReportData>(`/api/admin/reports?dateRange=${dateRange}`);
      return response.data;
    } catch (error: any) {
      console.error('Error generating report:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate report');
    }
  }

  /**
   * Get report statistics (for reports page)
   */
  async getReportStats(): Promise<{
    totalTickets: number;
    completedTickets: number;
    pendingTickets: number;
    inProgressTickets: number;
    averageCompletionTime: number;
    totalContractors: number;
    activeContractors: number;
  }> {
    try {
      const tickets = await this.getAllTickets();
      const contractors = await this.getAllContractors();
      
      const completed = tickets.filter(t => t.status === 'COMPLETED');
      const pending = tickets.filter(t => t.status === 'PENDING');
      const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS');
      
      // Calculate average completion time
      let totalTime = 0;
      let completedCount = 0;
      completed.forEach(ticket => {
        if (ticket.completedAt && ticket.createdAt) {
          const created = new Date(ticket.createdAt).getTime();
          const completedTime = new Date(ticket.completedAt).getTime();
          const timeDiff = (completedTime - created) / (1000 * 60 * 60 * 24); // days
          totalTime += timeDiff;
          completedCount++;
        }
      });
      
      const avgTime = completedCount > 0 ? totalTime / completedCount : 0;
      
      return {
        totalTickets: tickets.length,
        completedTickets: completed.length,
        pendingTickets: pending.length,
        inProgressTickets: inProgress.length,
        averageCompletionTime: Math.round(avgTime * 10) / 10,
        totalContractors: contractors.length,
        activeContractors: contractors.filter(c => c.status === 'ACTIVE').length,
      };
    } catch (error: any) {
      console.error('Error fetching report stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch report statistics');
    }
  }

  // ==================== HELPER METHODS ====================
  
  /**
   * Get contractor by ID
   */
  async getContractorById(contractorId: number): Promise<Contractor> {
    try {
      const contractors = await this.getPendingContractors();
      const contractor = contractors.find(c => c.id === contractorId);
      if (!contractor) {
        throw new Error('Contractor not found');
      }
      return contractor;
    } catch (error: any) {
      console.error('Error fetching contractor:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch contractor');
    }
  }
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;
