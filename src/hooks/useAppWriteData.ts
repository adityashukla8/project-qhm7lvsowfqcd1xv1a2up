import { useState, useEffect } from 'react';
import { appwriteSync } from '@/functions';

interface AppWriteDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  [key: string]: any;
}

interface UseAppWriteDataOptions {
  collection: string;
  filters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useAppWriteData<T extends AppWriteDocument>({
  collection,
  filters,
  autoFetch = true
}: UseAppWriteDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await appwriteSync({
        action: 'list',
        collection,
        filters
      });

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Omit<T, '$id' | '$createdAt' | '$updatedAt'>) => {
    try {
      const result = await appwriteSync({
        action: 'create',
        collection,
        data: documentData
      });

      if (result.success) {
        await fetchData(); // Refresh data
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateDocument = async (documentId: string, documentData: Partial<T>) => {
    try {
      const result = await appwriteSync({
        action: 'update',
        collection,
        documentId,
        data: documentData
      });

      if (result.success) {
        await fetchData(); // Refresh data
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const result = await appwriteSync({
        action: 'delete',
        collection,
        documentId
      });

      if (result.success) {
        await fetchData(); // Refresh data
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const getDocument = async (documentId: string) => {
    try {
      const result = await appwriteSync({
        action: 'get',
        collection,
        documentId
      });

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to get document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [collection, JSON.stringify(filters), autoFetch]);

  return {
    data,
    loading,
    error,
    fetchData,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument
  };
}