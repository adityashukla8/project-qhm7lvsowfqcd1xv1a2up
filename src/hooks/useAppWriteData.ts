import { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';

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
      // Initialize AppWrite client for frontend use
      const client = new Client();
      
      const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('Missing VITE_APPWRITE_PROJECT_ID environment variable');
      }

      client
        .setEndpoint(endpoint)
        .setProject(projectId);

      const databases = new Databases(client);
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'patient_info';

      // Build queries from filters
      const queries = [];
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          queries.push(Query.equal(key, value));
        });
      }

      const result = await databases.listDocuments(
        DATABASE_ID,
        collection,
        queries.length > 0 ? queries : undefined
      );

      setData(result.documents as T[]);
    } catch (err) {
      console.error('AppWrite data fetch error:', err);
      
      let errorMessage = 'Failed to fetch data';
      if (err instanceof Error) {
        if (err.message.includes('Missing')) {
          errorMessage = 'AppWrite configuration missing. Please check environment variables.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Unauthorized access. Please check your AppWrite permissions.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Database or collection not found. Please verify your AppWrite setup.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Omit<T, '$id' | '$createdAt' | '$updatedAt'>) => {
    try {
      const client = new Client();
      const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('Missing VITE_APPWRITE_PROJECT_ID environment variable');
      }

      client
        .setEndpoint(endpoint)
        .setProject(projectId);

      const databases = new Databases(client);
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'patient_info';

      const result = await databases.createDocument(
        DATABASE_ID,
        collection,
        'unique()',
        documentData
      );

      await fetchData(); // Refresh data
      return result;
    } catch (err) {
      console.error('AppWrite create error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create document';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateDocument = async (documentId: string, documentData: Partial<T>) => {
    try {
      const client = new Client();
      const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('Missing VITE_APPWRITE_PROJECT_ID environment variable');
      }

      client
        .setEndpoint(endpoint)
        .setProject(projectId);

      const databases = new Databases(client);
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'patient_info';

      const result = await databases.updateDocument(
        DATABASE_ID,
        collection,
        documentId,
        documentData
      );

      await fetchData(); // Refresh data
      return result;
    } catch (err) {
      console.error('AppWrite update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const client = new Client();
      const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('Missing VITE_APPWRITE_PROJECT_ID environment variable');
      }

      client
        .setEndpoint(endpoint)
        .setProject(projectId);

      const databases = new Databases(client);
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'patient_info';

      await databases.deleteDocument(
        DATABASE_ID,
        collection,
        documentId
      );

      await fetchData(); // Refresh data
      return true;
    } catch (err) {
      console.error('AppWrite delete error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getDocument = async (documentId: string) => {
    try {
      const client = new Client();
      const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('Missing VITE_APPWRITE_PROJECT_ID environment variable');
      }

      client
        .setEndpoint(endpoint)
        .setProject(projectId);

      const databases = new Databases(client);
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'patient_info';

      const result = await databases.getDocument(
        DATABASE_ID,
        collection,
        documentId
      );

      return result;
    } catch (err) {
      console.error('AppWrite get error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get document';
      setError(errorMessage);
      throw new Error(errorMessage);
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