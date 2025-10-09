import api from '@/lib/axios';

// ==================== TYPES ====================

export interface SuperadminStats {
  totalUsers: number;
  totalAdmins: number;
  totalTickets: number;
  totalContractors: number;
  systemUptime: string;
  databaseSize: string;
  activeUsers: number;
  systemLoad: number;
  criticalAlerts: number;
  pendingApprovals: number;
  systemHealth: string;
  activeConnections: number;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maxTicketsPerUser: number;
  maxContractorsPerRegion: number;
  dataRetentionDays: number;
}

export interface UserAuditLog {
  id: string;
  userId: number;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface SystemBackup {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed';
  type: 'full' | 'incremental';
}

class SuperadminService {

  // ==================== PHASE 2: VERIFICATION HIERARCHY ====================

  /**
   * Get pending admins for verification (Phase 2)
   */
  async getPendingAdmins(): Promise<any[]> {
    try {
      const response = await api.get('/api/superadmin/admins/pending');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending admins:', error);
      // Return mock data for development
      return [
        {
          id: 1,
          name: "John Admin",
          email: "john@geofix.com",
          mobile: "1234567890",
          department: "Public Works",
          employeeId: "EMP001",
          createdAt: new Date().toISOString(),
          status: "PENDING"
        }
      ];
    }
  }

  /**
   * Verify admin (Phase 2)
   */
  async verifyAdmin(adminId: number): Promise<void> {
    try {
      await api.put(`/api/superadmin/admins/${adminId}/verify`);
    } catch (error: any) {
      console.error('Error verifying admin:', error);
      throw new Error(error.response?.data?.error || 'Failed to verify admin');
    }
  }

  /**
   * Get superadmin dashboard statistics
   */
  async getDashboardStats(): Promise<SuperadminStats> {
    try {
      const response = await api.get<SuperadminStats>('/api/superadmin/dashboard');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching superadmin stats:', error);
      
      // Return mock data for development
      return {
        totalUsers: 1250,
        totalAdmins: 15,
        totalTickets: 3480,
        totalContractors: 85,
        systemUptime: '99.9%',
        databaseSize: '2.4 GB',
        activeUsers: 124,
        systemLoad: 45,
        criticalAlerts: 2,
        pendingApprovals: 8,
        systemHealth: 'Good',
        activeConnections: 67
      };
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Get all system users with detailed information
   */
  async getAllSystemUsers(): Promise<any[]> {
    try {
      const response = await api.get('/superadmin/users');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching system users:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch system users');
    }
  }

  /**
   * Promote user to admin
   */
  async promoteUserToAdmin(userId: number): Promise<void> {
    try {
      await api.post(`/superadmin/users/${userId}/promote-admin`);
    } catch (error: any) {
      console.error('Error promoting user to admin:', error);
      throw new Error(error.response?.data?.error || 'Failed to promote user to admin');
    }
  }

  /**
   * Demote admin to regular user
   */
  async demoteAdminToUser(userId: number): Promise<void> {
    try {
      await api.post(`/superadmin/users/${userId}/demote-admin`);
    } catch (error: any) {
      console.error('Error demoting admin to user:', error);
      throw new Error(error.response?.data?.error || 'Failed to demote admin to user');
    }
  }

  /**
   * Permanently delete user
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      await api.delete(`/superadmin/users/${userId}`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }

  /**
   * Get user audit logs
   */
  async getUserAuditLogs(userId?: number, limit = 100): Promise<UserAuditLog[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get<UserAuditLog[]>(`/superadmin/audit-logs?${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch audit logs');
    }
  }

  // ==================== SYSTEM CONFIGURATION ====================

  /**
   * Get system configuration
   */
  async getSystemConfig(): Promise<SystemConfig> {
    try {
      const response = await api.get<SystemConfig>('/superadmin/system/config');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching system config:', error);
      
      // Return default config for development
      return {
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        maxTicketsPerUser: 10,
        maxContractorsPerRegion: 50,
        dataRetentionDays: 365
      };
    }
  }

  /**
   * Update system configuration
   */
  async updateSystemConfig(config: Partial<SystemConfig>): Promise<void> {
    try {
      await api.put('/superadmin/system/config', config);
    } catch (error: any) {
      console.error('Error updating system config:', error);
      throw new Error(error.response?.data?.error || 'Failed to update system configuration');
    }
  }

  /**
   * Enable maintenance mode
   */
  async enableMaintenanceMode(): Promise<void> {
    try {
      await api.post('/superadmin/system/maintenance/enable');
    } catch (error: any) {
      console.error('Error enabling maintenance mode:', error);
      throw new Error(error.response?.data?.error || 'Failed to enable maintenance mode');
    }
  }

  /**
   * Disable maintenance mode
   */
  async disableMaintenanceMode(): Promise<void> {
    try {
      await api.post('/superadmin/system/maintenance/disable');
    } catch (error: any) {
      console.error('Error disabling maintenance mode:', error);
      throw new Error(error.response?.data?.error || 'Failed to disable maintenance mode');
    }
  }

  // ==================== BACKUP & RESTORE ====================

  /**
   * Get system backups
   */
  async getSystemBackups(): Promise<SystemBackup[]> {
    try {
      const response = await api.get<SystemBackup[]>('/superadmin/system/backups');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching backups:', error);
      
      // Return mock data for development
      return [
        {
          id: '1',
          name: 'Full Backup - ' + new Date().toLocaleDateString(),
          size: '1.2 GB',
          createdAt: new Date().toISOString(),
          status: 'completed',
          type: 'full'
        },
        {
          id: '2',
          name: 'Incremental Backup - ' + new Date(Date.now() - 86400000).toLocaleDateString(),
          size: '245 MB',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          type: 'incremental'
        }
      ];
    }
  }

  /**
   * Create system backup
   */
  async createBackup(type: 'full' | 'incremental' = 'incremental'): Promise<void> {
    try {
      await api.post('/superadmin/system/backups', { type });
    } catch (error: any) {
      console.error('Error creating backup:', error);
      throw new Error(error.response?.data?.error || 'Failed to create backup');
    }
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupId: string): Promise<void> {
    try {
      await api.post(`/superadmin/system/backups/${backupId}/restore`);
    } catch (error: any) {
      console.error('Error restoring backup:', error);
      throw new Error(error.response?.data?.error || 'Failed to restore backup');
    }
  }

  /**
   * Delete backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    try {
      await api.delete(`/superadmin/system/backups/${backupId}`);
    } catch (error: any) {
      console.error('Error deleting backup:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete backup');
    }
  }

  // ==================== SYSTEM MONITORING ====================

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<any> {
    try {
      const response = await api.get('/superadmin/system/health');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching system health:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch system health');
    }
  }

  /**
   * Get system performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    try {
      const response = await api.get('/superadmin/system/metrics');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching performance metrics:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch performance metrics');
    }
  }

  /**
   * Clear system cache
   */
  async clearSystemCache(): Promise<void> {
    try {
      await api.post('/superadmin/system/cache/clear');
    } catch (error: any) {
      console.error('Error clearing system cache:', error);
      throw new Error(error.response?.data?.error || 'Failed to clear system cache');
    }
  }

  /**
   * Restart system services
   */
  async restartServices(): Promise<void> {
    try {
      await api.post('/superadmin/system/services/restart');
    } catch (error: any) {
      console.error('Error restarting services:', error);
      throw new Error(error.response?.data?.error || 'Failed to restart services');
    }
  }

  // ==================== ADDITIONAL MISSING ENDPOINTS ====================

  /**
   * Get all system users (comprehensive list)
   */
  async getAllUsers(): Promise<any[]> {
    try {
      const response = await api.get('/api/superadmin/users');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      // Return mock data for development
      return [
        {
          id: 1,
          name: "John Citizen",
          email: "john@citizen.com",
          mobile: "1234567890",
          role: "ROLE_CITIZEN",
          status: "ACTIVE",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Jane Admin",
          email: "jane@admin.com",
          mobile: "1234567891",
          role: "ROLE_ADMIN",
          status: "ACTIVE",
          createdAt: new Date().toISOString()
        }
      ];
    }
  }

  /**
   * Promote user to admin
   */
  async promoteUserToAdmin(userId: number): Promise<void> {
    try {
      await api.post(`/api/superadmin/users/${userId}/promote-admin`);
    } catch (error: any) {
      console.error('Error promoting user to admin:', error);
      throw new Error(error.response?.data?.error || 'Failed to promote user to admin');
    }
  }

  /**
   * Demote admin to regular user
   */
  async demoteAdminToUser(userId: number): Promise<void> {
    try {
      await api.post(`/api/superadmin/users/${userId}/demote-admin`);
    } catch (error: any) {
      console.error('Error demoting admin to user:', error);
      throw new Error(error.response?.data?.error || 'Failed to demote admin to user');
    }
  }

  /**
   * Delete user permanently
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      await api.delete(`/api/superadmin/users/${userId}`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }

  /**
   * Get user audit logs
   */
  async getUserAuditLogs(userId?: number, limit = 100): Promise<UserAuditLog[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get<UserAuditLog[]>(`/api/superadmin/audit-logs?${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          userId: 1,
          userName: 'John Citizen',
          action: 'LOGIN',
          details: 'User logged in successfully',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date().toISOString()
        }
      ];
    }
  }

  /**
   * Get system configuration
   */
  async getSystemConfig(): Promise<SystemConfig> {
    try {
      const response = await api.get<SystemConfig>('/api/superadmin/system/config');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching system config:', error);
      // Return default config for development
      return {
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        maxTicketsPerUser: 10,
        maxContractorsPerRegion: 50,
        dataRetentionDays: 365
      };
    }
  }

  /**
   * Update system configuration
   */
  async updateSystemConfig(config: Partial<SystemConfig>): Promise<void> {
    try {
      await api.put('/api/superadmin/system/config', config);
    } catch (error: any) {
      console.error('Error updating system config:', error);
      throw new Error(error.response?.data?.error || 'Failed to update system configuration');
    }
  }

  /**
   * Enable maintenance mode
   */
  async enableMaintenanceMode(): Promise<void> {
    try {
      await api.post('/api/superadmin/system/maintenance/enable');
    } catch (error: any) {
      console.error('Error enabling maintenance mode:', error);
      throw new Error(error.response?.data?.error || 'Failed to enable maintenance mode');
    }
  }

  /**
   * Disable maintenance mode
   */
  async disableMaintenanceMode(): Promise<void> {
    try {
      await api.post('/api/superadmin/system/maintenance/disable');
    } catch (error: any) {
      console.error('Error disabling maintenance mode:', error);
      throw new Error(error.response?.data?.error || 'Failed to disable maintenance mode');
    }
  }
}

// Export singleton instance
const superadminService = new SuperadminService();
export default superadminService;