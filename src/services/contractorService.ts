import api from '@/lib/axios';

// Types based on backend DTOs
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

export interface WorkerCreateRequest {
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
}

export interface WorkerUpdateRequest {
  name?: string;
}

export interface TaskAssignRequest {
  workerId: number;
}

export interface ContractorTicket {
  id: number;
  title: string;
  description: string;
  location: string;
  photos?: string[];
  status: string;
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
}

class ContractorService {
    // ==================== PHASE 4: WORKER MANAGEMENT ====================
  async createWorker(workerData: WorkerCreateRequest): Promise<Worker> {
    try {
      const response = await api.post<Worker>('/api/contractor/workers', workerData);
      return response.data;
    } catch (error: any) {
      console.error('Create worker error:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create worker');
    }
  }

  async getWorkers(): Promise<Worker[]> {
    try {
      const response = await api.get<Worker[]>('/api/contractor/workers');
      return response.data;
    } catch (error: any) {
      console.error('Get workers error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch workers');
    }
  }

  async updateWorker(id: number, updates: WorkerUpdateRequest): Promise<string> {
    try {
      const response = await api.put<string>(`/api/contractor/workers/${id}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('Update worker error:', error);
      throw new Error(error.response?.data?.error || 'Failed to update worker');
    }
  }

  async deleteWorker(id: number): Promise<string> {
    try {
      const response = await api.delete<string>(`/api/contractor/workers/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete worker error:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete worker');
    }
  }

  // Ticket Management
  async getAssignedTickets(): Promise<ContractorTicket[]> {
    try {
      console.log('📡 Fetching contractor tickets...');
      const response = await api.get<ContractorTicket[]>('/api/contractor/tickets');
      console.log('✅ Contractor tickets response:', response.data?.length || 0, 'tickets');
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Get assigned tickets error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // Return empty array instead of throwing to prevent UI crashes
      if (error.response?.status === 404) {
        console.warn('⚠️ Tickets endpoint not found, returning empty array');
        return [];
      }
      if (error.response?.status >= 500) {
        console.warn('⚠️ Server error, returning empty array');
        return [];
      }
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch tickets');
    }
  }

  async assignTicketToWorker(ticketId: number, workerId: number): Promise<string> {
    try {
      const response = await api.put<string>(
        `/api/contractor/tickets/${ticketId}/assign`,
        { workerId }
      );
      return response.data;
    } catch (error: any) {
      console.error('Assign ticket to worker error:', error);
      throw new Error(error.response?.data?.error || error.response?.data || 'Failed to assign ticket');
    }
  }

  // Helper methods
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Pending',
      'ASSIGNED_TO_CONTRACTOR': 'Assigned to You',
      'ASSIGNED_TO_WORKER': 'Assigned to Worker',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'REJECTED': 'Rejected'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'ASSIGNED_TO_CONTRACTOR': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'ASSIGNED_TO_WORKER': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'IN_PROGRESS': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
}

export const contractorService = new ContractorService();
