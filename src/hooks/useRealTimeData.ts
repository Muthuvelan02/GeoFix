import { useState, useEffect, useCallback } from 'react';
import adminService from '@/services/adminService';
import { TicketForAdmin } from '@/services/adminService';

interface RealTimeData {
  tickets: TicketForAdmin[];
  newTicketsCount: number;
  lastUpdate: Date;
}

interface UseRealTimeDataOptions {
  pollingInterval?: number; // in milliseconds
  enabled?: boolean;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const { pollingInterval = 10000, enabled = false } = options; // Default disabled for manual refresh only
  const [data, setData] = useState<RealTimeData>({
    tickets: [],
    newTicketsCount: 0,
    lastUpdate: new Date()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tickets = await adminService.getAllTickets();
      const now = new Date();
      
      setData(prevData => {
        // Calculate new tickets since last update
        const newTickets = tickets.filter(ticket => {
          const ticketDate = new Date(ticket.createdAt);
          return ticketDate > prevData.lastUpdate;
        });

        return {
          tickets,
          newTicketsCount: newTickets.length,
          lastUpdate: now
        };
      });
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchTickets();

    // Set up polling
    const interval = setInterval(fetchTickets, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchTickets, pollingInterval, enabled]);

  const refresh = useCallback(() => {
    fetchTickets();
  }, [fetchTickets]);

  const clearNewTicketsCount = useCallback(() => {
    setData(prev => ({
      ...prev,
      newTicketsCount: 0
    }));
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    clearNewTicketsCount
  };
};
