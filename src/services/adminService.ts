import api from '@/lib/axios';
import { Ticket } from '@/types';

// ==================== TYPES ====================

export interface SystemStats {
  totalUsers: number;
  totalTickets: number;
  totalContractors: number;
  pendingTickets: number;
  completedTickets: number;
  activeContractors: number;
  pendingApprovals: number;
  systemHealth: 'Good' | 'Warning' | 'Critical';
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export interface AdminDashboardData {
  stats: SystemStats;
  recentTickets: TicketForAdmin[];
  pendingApprovals: AdminUser[];
  systemAlerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

export interface Contractor {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: 'PENDING' | 'ACTIVE' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  roles: string[];
  photoUrl?: string;
  aadharFrontUrl?: string;
  aadharBackUrl?: string;
  createdAt: string;
  updatedAt?: string;
  specialization?: string;
  description?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  role: string[];
  status: 'PENDING' | 'ACTIVE' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
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
  totalCitizens?: number;
  totalContractors?: number;
  inProgressTickets?: number;
  assignedTickets?: number;
}

export interface ReportData {
  resolvedTickets: number;
  unresolvedTickets: number;
  dateRange: string;
  totalTickets?: number;
  completedTickets?: number;
  pendingTickets?: number;
  inProgressTickets?: number;
}

// ==================== SERVICE CLASS ====================

class AdminService {
  
  // ==================== USER MANAGEMENT ====================
  
  /**
   * Get all users in the system
   */
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      // Since there's no /admin/users endpoint, we'll get users from pending contractors
      // and combine with other data sources
      const [pendingContractors, allTickets] = await Promise.all([
        this.getPendingContractors(),
        this.viewAllTickets()
      ]);

      // Extract unique citizens from tickets
      const citizens = allTickets.map(ticket => ({
        id: ticket.citizen.id,
        name: ticket.citizen.name,
        email: ticket.citizen.email,
        mobile: ticket.citizen.mobile,
        role: ['ROLE_CITIZEN'],
        status: 'ACTIVE' as const,
        createdAt: ticket.createdAt,
        ticketsCreated: allTickets.filter(t => t.citizen.id === ticket.citizen.id).length
      }));

      // Remove duplicates
      const uniqueCitizens = citizens.filter((citizen, index, self) => 
        index === self.findIndex(c => c.id === citizen.id)
      );

      // Convert contractors to admin users format
      const contractors = pendingContractors.map(contractor => ({
        id: contractor.id,
        name: contractor.name,
        email: contractor.email,
        mobile: contractor.mobile,
        address: contractor.address,
        role: contractor.roles,
        status: contractor.status,
        photoUrl: contractor.photoUrl,
        createdAt: contractor.createdAt,
        companyName: contractor.specialization,
        specialization: contractor.specialization
      }));

      return [...uniqueCitizens, ...contractors];
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch users');
    }
  }

  /**
   * Get all tickets in the system
   */
  async getAllTickets(): Promise<TicketForAdmin[]> {
    try {
      const response = await api.get<TicketForAdmin[]>('/api/tickets');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all tickets:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch tickets');
    }
  }

  // ==================== CONTRACTOR MANAGEMENT ====================

  /**
   * Get all contractors (both pending and active)
   * Since there's no single endpoint for all contractors, we'll use the pending endpoint
   * and handle the fact that it only returns pending contractors
   */
  async getAllContractors(): Promise<Contractor[]> {
    try {
      console.log('🔍 Fetching contractors from API...');
      console.log('API URL: /api/admin/contractors/pending');
      
      // Get pending contractors from the available endpoint
      const response = await api.get<Contractor[]>('/api/admin/contractors/pending');
      
      console.log('✅ API Response received');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Number of contractors found:', response.data?.length || 0);
      
      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.warn('⚠️ Response data is not an array:', response.data);
        return [];
      }

      // Check if jv@cont.com is in the response
      const targetContractor = response.data.find(c => c.email === 'jv@cont.com');
      if (targetContractor) {
        console.log('✅ Found jv@cont.com in API response:', targetContractor);
      } else {
        console.log('❌ jv@cont.com NOT found in API response');
        console.log('Available contractors:', response.data.map(c => ({ id: c.id, email: c.email, status: c.status })));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching all contractors:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch contractors');
    }
  }

  /**
   * Get active contractors only (for assignment)
   * Since there's no backend endpoint for active contractors, we'll use mock data
   * In a real implementation, this would need a backend endpoint
   */
  async getActiveContractors(): Promise<Contractor[]> {
    try {
      // Backend currently exposes only pending contractors endpoint.
      // Fetch pending and filter for ACTIVE/VERIFIED in case backend evolves to include them.
      const response = await api.get<Contractor[]>('/api/admin/contractors/pending');
      const data = Array.isArray(response.data) ? response.data : [];
      return data.filter(c => c.status === 'ACTIVE' || c.status === 'VERIFIED');
    } catch (error: any) {
      console.error('Error fetching active contractors:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch active contractors');
    }
  }

  /**
   * Get pending contractors for verification (Phase 2)
   */
  async getPendingContractors(): Promise<Contractor[]> {
    try {
      const response = await api.get<Contractor[]>('/api/admin/contractors/pending');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending contractors:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch pending contractors');
    }
  }

  /**
   * Verify contractor (Phase 2)
   */
  async verifyContractor(contractorId: number): Promise<void> {
    try {
      console.log(`Attempting to verify contractor with ID: ${contractorId}`);
      const response = await api.put(`/api/admin/contractors/${contractorId}/verify`, {
        status: 'VERIFIED'
      });
      console.log('Contractor verification response:', response.data);
    } catch (error: any) {
      console.error('Error verifying contractor:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error('Contractor not found. Please refresh the page and try again.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid contractor data. Please check the contractor information.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error during verification. Please try again.');
      } else {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to verify contractor');
      }
    }
  }

  /**
   * Reject contractor (Phase 2)
   */
  async rejectContractor(contractorId: number, reason?: string): Promise<void> {
    try {
      await api.put(`/api/admin/contractors/${contractorId}/verify`, {
        status: 'REJECTED'
      });
    } catch (error: any) {
      console.error('Error rejecting contractor:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to reject contractor');
    }
  }

  // ==================== PHASE 3: TICKET MANAGEMENT ====================

  /**
   * View all tickets (Phase 3)
   */
  async viewAllTickets(): Promise<TicketForAdmin[]> {
    try {
      const response = await api.get<TicketForAdmin[]>('/api/tickets');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all tickets:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch tickets');
    }
  }

  // Removed duplicate assignTicketToContractor definition (use the one below)

  // ==================== PHASE 6: MONITORING ====================

  // Removed getAdminDashboard; use getDashboardData/getDashboardStats aligned to backend

  // Removed duplicate generateReports definition (use the one below)

  // ==================== HELPER METHODS ====================

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStats> {
    try {
      const [tickets, users, contractors] = await Promise.all([
        this.getAllTickets(),
        this.getAllUsers(),
        this.getPendingContractors()
      ]);

      const pendingTickets = tickets.filter(t => t.status === 'PENDING').length;
      const completedTickets = tickets.filter(t => t.status === 'COMPLETED').length;
      const activeContractors = contractors.filter(c => c.status === 'ACTIVE').length;
      const pendingApprovals = users.filter(u => u.status === 'PENDING').length;

      // Determine system health based on metrics
      let systemHealth: 'Good' | 'Warning' | 'Critical' = 'Good';
      if (pendingTickets > 100 || pendingApprovals > 50) {
        systemHealth = 'Warning';
      }
      if (pendingTickets > 200 || pendingApprovals > 100) {
        systemHealth = 'Critical';
      }

      return {
        totalUsers: users.length,
        totalTickets: tickets.length,
        totalContractors: contractors.length,
        pendingTickets,
        completedTickets,
        activeContractors,
        pendingApprovals,
        systemHealth,
        recentActivity: [
          {
            id: '1',
            type: 'ticket_created',
            message: 'New ticket created in downtown area',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'contractor_approved',
            message: 'Contractor John Doe approved',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      };
    } catch (error: any) {
      console.error('Error fetching system stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch system statistics');
    }
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>('/api/admin/dashboard');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }

  /**
   * Approve user
   */
  async approveUser(userId: number): Promise<void> {
    try {
      // Since there's no /admin/users endpoint, we'll use the contractor verification endpoint
      // This is a workaround for the current backend implementation
      await api.put(`/api/admin/contractors/${userId}/verify`, {
        status: 'VERIFIED'
      });
    } catch (error: any) {
      console.error('Error approving user:', error);
      throw new Error(error.response?.data?.error || 'Failed to approve user');
    }
  }

  /**
   * Reject user
   */
  async rejectUser(userId: number, reason?: string): Promise<void> {
    try {
      // Since there's no /admin/users endpoint, we'll use the contractor verification endpoint
      // This is a workaround for the current backend implementation
      await api.put(`/api/admin/contractors/${userId}/verify`, {
        status: 'REJECTED'
      });
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      throw new Error(error.response?.data?.error || 'Failed to reject user');
    }
  }

  /**
   * Get reports
   */
  async getReports(): Promise<ReportData> {
    try {
      const response = await api.get<ReportData>('/api/admin/reports?dateRange=2025-01-01:2025-12-31');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch reports');
    }
  }

  /**
   * Get report statistics
   */
  async getReportStats(): Promise<ReportData> {
    return this.getReports();
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: number, status: 'ACTIVE' | 'SUSPENDED' | 'REJECTED'): Promise<void> {
    try {
      // Since there's no /admin/users endpoint, we'll use the contractor verification endpoint
      // This is a workaround for the current backend implementation
      if (status === 'ACTIVE') {
        await api.put(`/api/admin/contractors/${userId}/verify`, {
          status: 'VERIFIED'
        });
      } else if (status === 'REJECTED') {
        await api.put(`/api/admin/contractors/${userId}/verify`, {
          status: 'REJECTED'
        });
      } else {
        // For SUSPENDED status, we'll use the reject status
        await api.put(`/api/admin/contractors/${userId}/verify`, {
          status: 'REJECTED'
        });
      }
    } catch (error: any) {
      console.error('Error updating user status:', error);
      throw new Error(error.response?.data?.error || 'Failed to update user status');
    }
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: number): Promise<void> {
    return this.updateUserStatus(userId, 'SUSPENDED');
  }

  /**
   * Activate a user
   */
  async activateUser(userId: number): Promise<void> {
    return this.updateUserStatus(userId, 'ACTIVE');
  }

  /**
   * Get tickets assigned to contractors
   */
  async getAssignedTickets(): Promise<Ticket[]> {
    try {
      const response = await api.get<Ticket[]>('/api/admin/tickets/assigned');
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
      await api.put(`/api/admin/tickets/${ticketId}/assign`, {
        contractorId
      });
    } catch (error: any) {
      console.error('Error assigning ticket to contractor:', error);
      throw new Error(error.response?.data?.error || 'Failed to assign ticket to contractor');
    }
  }

  /**
   * Get admin dashboard data
   */
  async getDashboardData(): Promise<{
    pendingTickets: number;
    verifiedContractors: number;
  }> {
    try {
      const response = await api.get<{
        pendingTickets: number;
        verifiedContractors: number;
      }>('/api/admin/dashboard');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      // Return mock data for development
      return {
        pendingTickets: 15,
        verifiedContractors: 8
      };
    }
  }

  /**
   * Generate reports
   */
  async generateReports(dateRange: string): Promise<{
    resolvedTickets: number;
    unresolvedTickets: number;
    dateRange: string;
  }> {
    try {
      const response = await api.get<{
        resolvedTickets: number;
        unresolvedTickets: number;
        dateRange: string;
      }>(`/api/admin/reports?dateRange=${dateRange}`);
      return response.data;
    } catch (error: any) {
      console.error('Error generating reports:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to generate reports');
    }
  }
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;