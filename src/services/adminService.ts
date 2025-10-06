import api from '@/lib/axios';

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
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
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
      const response = await api.get<AdminUser[]>('/admin/users');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      // Return mock data for development
      return [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          mobile: "9876543210",
          role: ['ROLE_CITIZEN'],
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      ];
    }
  }

  /**
   * Get all tickets in the system
   */
  async getAllTickets(): Promise<TicketForAdmin[]> {
    try {
      const response = await api.get<TicketForAdmin[]>('/admin/tickets');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all tickets:', error);
      // Return mock data for development
      return [
        {
          id: 1,
          title: "Pothole on Main Street",
          description: "Large pothole causing traffic issues",
          location: "Main Street, Downtown",
          status: 'PENDING',
          citizen: {
            id: 1,
            name: "John Citizen",
            email: "john@citizen.com",
            mobile: "9876543210"
          },
          createdAt: new Date().toISOString()
        }
      ];
    }
  }

  // ==================== CONTRACTOR MANAGEMENT ====================

  /**
   * Get all contractors
   */
  async getAllContractors(): Promise<Contractor[]> {
    try {
      const response = await api.get<Contractor[]>('/api/admin/contractors');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all contractors:', error);
      // Return mock data for development
      return [
        {
          id: 1,
          name: "ABC Construction",
          email: "abc@construction.com",
          mobile: "9876543210",
          address: "123 Builder Street",
          status: 'ACTIVE',
          roles: ['ROLE_CONTRACTOR'],
          createdAt: new Date().toISOString(),
          specialization: "Road Construction",
          description: "Experienced in road and infrastructure projects"
        },
        {
          id: 2,
          name: "XYZ Infrastructure",
          email: "xyz@infrastructure.com",
          mobile: "9876543211",
          address: "456 Builder Avenue",
          status: 'ACTIVE',
          roles: ['ROLE_CONTRACTOR'],
          createdAt: new Date().toISOString(),
          specialization: "Water Management",
          description: "Specialized in water and drainage systems"
        }
      ];
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
      // Return mock data for development
      return [
        {
          id: 1,
          name: "ABC Construction",
          email: "abc@construction.com",
          mobile: "9876543210",
          address: "123 Builder Street",
          status: 'PENDING',
          roles: ['ROLE_CONTRACTOR'],
          createdAt: new Date().toISOString(),
          specialization: "Road Construction",
          description: "Experienced in road and infrastructure projects"
        }
      ];
    }
  }

  /**
   * Verify contractor (Phase 2)
   */
  async verifyContractor(contractorId: number): Promise<void> {
    try {
      await api.put(`/api/admin/contractors/${contractorId}/verify`);
    } catch (error: any) {
      console.error('Error verifying contractor:', error);
      throw new Error(error.response?.data?.error || 'Failed to verify contractor');
    }
  }

  /**
   * Reject contractor (Phase 2)
   */
  async rejectContractor(contractorId: number, reason?: string): Promise<void> {
    try {
      await api.put(`/api/admin/contractors/${contractorId}/reject`, { reason });
    } catch (error: any) {
      console.error('Error rejecting contractor:', error);
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
      // Return mock data for development
      return [
        {
          id: 1,
          title: "Pothole on Main Street",
          description: "Large pothole causing traffic issues",
          location: "Main Street, Downtown",
          status: 'PENDING',
          citizen: {
            id: 1,
            name: "John Citizen",
            email: "john@citizen.com",
            mobile: "9876543210"
          },
          createdAt: new Date().toISOString()
        }
      ];
    }
  }

  /**
   * Assign ticket to contractor (Phase 3)
   */
  async assignTicketToContractor(ticketId: number, contractorId: number): Promise<void> {
    try {
      await api.put(`/api/admin/tickets/${ticketId}/assign`, { contractorId });
    } catch (error: any) {
      console.error('Error assigning ticket to contractor:', error);
      throw new Error(error.response?.data?.error || 'Failed to assign ticket');
    }
  }

  // ==================== PHASE 6: MONITORING ====================

  /**
   * Get admin dashboard (Phase 6)
   */
  async getAdminDashboard(): Promise<AdminDashboardData> {
    try {
      const response = await api.get<AdminDashboardData>('/api/admin/dashboard');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin dashboard:', error);
      // Return mock data for development
      return this.getAdminDashboardMockData();
    }
  }

  /**
   * Generate reports (Phase 6)
   */
  async generateReports(reportType: 'tickets' | 'contractors' | 'system', dateRange?: { from: string; to: string }): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('from', dateRange.from);
        params.append('to', dateRange.to);
      }
      const response = await api.get(`/api/admin/reports?type=${reportType}&${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Error generating reports:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate reports');
    }
  }

  // ==================== HELPER METHODS ====================

  private getAdminDashboardMockData(): AdminDashboardData {
    const stats: SystemStats = {
      totalUsers: 156,
      totalTickets: 47,
      totalContractors: 8,
      pendingTickets: 12,
      completedTickets: 35,
      activeContractors: 6,
      pendingApprovals: 3,
      systemHealth: 'Good',
      recentActivity: [
        {
          id: '1',
          type: 'ticket_created',
          message: 'New ticket created in downtown area',
          timestamp: new Date().toISOString()
        }
      ]
    };

    return {
      stats,
      recentTickets: [],
      pendingApprovals: [],
      systemAlerts: []
    };
  }

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
      const response = await api.get<DashboardStats>('/admin/dashboard/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data for development
      return {
        pendingTickets: 12,
        verifiedContractors: 8,
        totalTickets: 47,
        activeContractors: 6,
        completedTickets: 35
      };
    }
  }

  /**
   * Approve user
   */
  async approveUser(userId: number): Promise<void> {
    try {
      await api.post(`/admin/users/${userId}/approve`);
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
      await api.post(`/admin/users/${userId}/reject`, { reason });
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
      const response = await api.get<ReportData>('/admin/reports');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      // Return mock data for development
      return {
        resolvedTickets: 35,
        unresolvedTickets: 12,
        dateRange: "Last 30 days",
        totalTickets: 47,
        completedTickets: 35,
        pendingTickets: 12,
        inProgressTickets: 0
      };
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
      await api.put(`/admin/users/${userId}/status`, { status });
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
}

// Export singleton instance
const adminService = new AdminService();
export default adminService;