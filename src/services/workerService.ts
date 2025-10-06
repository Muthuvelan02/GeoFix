import api from '@/lib/axios';

// ==================== TYPES ====================

export interface WorkerTask {
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

export interface TaskUpdateRequest {
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface CompletedTask extends WorkerTask {
  rating?: number;
  feedback?: string;
  timeTaken?: number; // in hours
}

// ==================== SERVICE CLASS ====================

class WorkerService {
  
  // ==================== PHASE 5: TASK RESOLUTION ====================
  
  /**
   * View assigned tasks (Phase 5)
   */
  async getMyTasks(): Promise<WorkerTask[]> {
    try {
      const response = await api.get<WorkerTask[]>('/api/worker/tasks');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching worker tasks:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  /**
   * Get tasks by status
   */
  async getTasksByStatus(status: 'ASSIGNED_TO_WORKER' | 'IN_PROGRESS' | 'COMPLETED'): Promise<WorkerTask[]> {
    try {
      const allTasks = await this.getMyTasks();
      return allTasks.filter(task => task.status === status);
    } catch (error: any) {
      console.error('Error fetching tasks by status:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  /**
   * Start working on a task (change status to IN_PROGRESS)
   */
  async startTask(taskId: number): Promise<WorkerTask> {
    try {
      const formData = new FormData();
      const taskData = { status: 'IN_PROGRESS' };
      formData.append('taskData', JSON.stringify(taskData));
      
      const response = await api.put<{ message: string; ticket: WorkerTask }>(
        `/api/worker/tasks/${taskId}`,
        formData
      );
      return response.data.ticket;
    } catch (error: any) {
      console.error('Error starting task:', error);
      throw new Error(error.response?.data?.error || 'Failed to start task');
    }
  }

  /**
   * Complete a task with proof of work photo
   */
  async completeTask(taskId: number, proofPhoto: File): Promise<WorkerTask> {
    try {
      const formData = new FormData();
      const taskData = { status: 'COMPLETED' };
      formData.append('taskData', JSON.stringify(taskData));
      formData.append('proofPhoto', proofPhoto);
      
      const response = await api.put<{ message: string; ticket: WorkerTask }>(
        `/api/worker/tasks/${taskId}`,
        formData
      );
      return response.data.ticket;
    } catch (error: any) {
      console.error('Error completing task:', error);
      throw new Error(error.response?.data?.error || 'Failed to complete task');
    }
  }

  /**
   * Get completed tasks for history/performance tracking
   */
  async getCompletedTasks(): Promise<CompletedTask[]> {
    try {
      const allTasks = await this.getMyTasks();
      const completed = allTasks.filter(task => task.status === 'COMPLETED');
      
      // Enhance with calculated fields
      return completed.map(task => {
        let timeTaken = 0;
        if (task.completedAt && task.assignedAt) {
          const started = new Date(task.assignedAt).getTime();
          const completed = new Date(task.completedAt).getTime();
          timeTaken = Math.round((completed - started) / (1000 * 60 * 60)); // hours
        }
        
        return {
          ...task,
          timeTaken,
          // These would come from a rating system (not in current backend)
          rating: undefined,
          feedback: undefined,
        };
      });
    } catch (error: any) {
      console.error('Error fetching completed tasks:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch completed tasks');
    }
  }

  // ==================== STATISTICS & ANALYTICS ====================
  
  /**
   * Get worker performance statistics
   */
  async getPerformanceStats(): Promise<{
    totalCompleted: number;
    totalInProgress: number;
    totalAssigned: number;
    averageCompletionTime: number;
    averageRating: number;
    totalHoursWorked: number;
  }> {
    try {
      const tasks = await this.getMyTasks();
      const completedTasks = await this.getCompletedTasks();
      
      const completed = tasks.filter(t => t.status === 'COMPLETED');
      const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
      const assigned = tasks.filter(t => t.status === 'ASSIGNED_TO_WORKER');
      
      // Calculate average completion time
      let totalTime = 0;
      let countWithTime = 0;
      
      completedTasks.forEach(task => {
        if (task.timeTaken && task.timeTaken > 0) {
          totalTime += task.timeTaken;
          countWithTime++;
        }
      });
      
      const avgTime = countWithTime > 0 ? totalTime / countWithTime : 0;
      
      return {
        totalCompleted: completed.length,
        totalInProgress: inProgress.length,
        totalAssigned: assigned.length,
        averageCompletionTime: Math.round(avgTime * 10) / 10,
        averageRating: 4.5, // Mock - would come from rating system
        totalHoursWorked: totalTime,
      };
    } catch (error: any) {
      console.error('Error fetching performance stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch performance statistics');
    }
  }

  // ==================== HELPER METHODS ====================
  
  /**
   * Get task by ID
   */
  async getTaskById(taskId: number): Promise<WorkerTask> {
    try {
      const tasks = await this.getMyTasks();
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error: any) {
      console.error('Error fetching task:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch task');
    }
  }

  /**
   * Check if worker can start a task
   */
  canStartTask(task: WorkerTask): boolean {
    return task.status === 'ASSIGNED_TO_WORKER';
  }

  /**
   * Check if worker can complete a task
   */
  canCompleteTask(task: WorkerTask): boolean {
    return task.status === 'IN_PROGRESS';
  }

  /**
   * Get task status label
   */
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pending',
      'ASSIGNED_TO_CONTRACTOR': 'Assigned to Contractor',
      'ASSIGNED_TO_WORKER': 'Assigned to You',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
    };
    return labels[status] || status;
  }

  /**
   * Get status color for badges
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
      'ASSIGNED_TO_CONTRACTOR': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      'ASSIGNED_TO_WORKER': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
      'IN_PROGRESS': 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
      'COMPLETED': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format datetime for display
   */
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get priority badge (if priority field is added to backend)
   */
  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      'HIGH': 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
      'MEDIUM': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
      'LOW': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    };
    return colors[priority] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700';
  }

  /**
   * Get photo URL (handle relative and absolute URLs)
   */
  getPhotoUrl(photoPath: string): string {
    if (!photoPath) return '';
    
    // If it's already a full URL, return as is
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    
    // Otherwise, construct URL with API base
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9050';
    return `${baseURL}/${photoPath}`;
  }
}

// Export singleton instance
const workerService = new WorkerService();
export default workerService;
