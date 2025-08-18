import { useState, useEffect, useCallback } from 'react';
import type { StatusData, UseStatusResult, ApiError } from '../types/status';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const REFRESH_INTERVAL = 30000; // 30 seconds

export const useStatus = (): UseStatusResult => {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching status from: ${API_BASE_URL}/api/status`);
      console.log(`Environment: ${import.meta.env.MODE}, API URL: ${API_BASE_URL}`);
      
      const response = await fetch(`${API_BASE_URL}/api/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Failed to parse error response',
          status: response.status,
          statusText: response.statusText,
          timestamp: new Date().toISOString()
        }));
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      // Transform new API structure to legacy structure for component compatibility
      const statusData: StatusData = {
        ...rawData,
        // Add legacy implementation structure for backward compatibility
        implementation: {
          totalTools: rawData.tools?.total || 0,
          completedTools: rawData.tools?.tested || 0,
          inProgressTools: rawData.tools?.total - rawData.tools?.tested || 0,
          plannedTools: 0
        }
      };
      
      // Validate that we received expected data structure
      if (!statusData._meta || !statusData.project || !statusData.tools) {
        throw new Error('Invalid STATUS.json structure received from API');
      }

      setData(statusData);
      setLastFetch(new Date());
      console.log('Successfully fetched status data:', statusData);
      
    } catch (err) {
      console.error('Error fetching status:', err);
      
      const apiError: ApiError = {
        error: err instanceof Error ? err.name : 'Unknown Error',
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        timestamp: new Date().toISOString()
      };
      
      setError(apiError);
      
      // Don't clear existing data on error - keep showing last known good state
      // unless this is the first fetch
      if (!data) {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [data]);

  const refetch = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing status data...');
      fetchStatus();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  return {
    data,
    loading,
    error,
    refetch,
    lastFetch,
  };
};