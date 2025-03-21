import { useState, useEffect } from "react";

// Generic hook for fetching data
export function useDataQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await queryFn();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, error, isLoading };
}

// Mock hook for real-time data
export function useRealtimeData<T>(
  resourceName: string,
  queryFn: () => Promise<T[]>,
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const initialData = await queryFn();
        setData(initialData);
      } catch (err) {
        console.error(`Error fetching initial ${resourceName} data:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Set up polling for real-time simulation
    const intervalId = setInterval(() => {
      fetchInitialData();
    }, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceName]);

  return { data, error, isLoading };
}
