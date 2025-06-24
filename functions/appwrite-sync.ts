import { Client, Databases, Query } from 'npm:appwrite@15.0.0';

Deno.serve(async (req) => {
  try {
    // Initialize AppWrite client
    const client = new Client();
    
    const endpoint = Deno.env.get('APPWRITE_ENDPOINT') || 'https://cloud.appwrite.io/v1';
    const projectId = Deno.env.get('APPWRITE_PROJECT_ID');
    const apiKey = Deno.env.get('APPWRITE_API_KEY');
    
    if (!projectId || !apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required environment variables: APPWRITE_PROJECT_ID or APPWRITE_API_KEY'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    client
      .setEndpoint(endpoint)
      .setProject(projectId);

    // For server-side operations, we need to set the API key differently
    client.headers['X-Appwrite-Key'] = apiKey;

    const databases = new Databases(client);
    const DATABASE_ID = 'patient_info';

    const { action, collection, data, documentId, filters } = await req.json();

    switch (action) {
      case 'list':
        const queries = [];
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            queries.push(Query.equal(key, value as string));
          });
        }
        
        const listResult = await databases.listDocuments(
          DATABASE_ID,
          collection,
          queries.length > 0 ? queries : undefined
        );
        
        return new Response(JSON.stringify({
          success: true,
          data: listResult.documents,
          total: listResult.total
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

      case 'get':
        if (!documentId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Document ID is required for get operation'
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const getResult = await databases.getDocument(
          DATABASE_ID,
          collection,
          documentId
        );
        
        return new Response(JSON.stringify({
          success: true,
          data: getResult
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

      case 'create':
        if (!data) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Data is required for create operation'
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const createResult = await databases.createDocument(
          DATABASE_ID,
          collection,
          'unique()',
          data
        );
        
        return new Response(JSON.stringify({
          success: true,
          data: createResult
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

      case 'update':
        if (!documentId || !data) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Document ID and data are required for update operation'
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const updateResult = await databases.updateDocument(
          DATABASE_ID,
          collection,
          documentId,
          data
        );
        
        return new Response(JSON.stringify({
          success: true,
          data: updateResult
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

      case 'delete':
        if (!documentId) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Document ID is required for delete operation'
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        await databases.deleteDocument(
          DATABASE_ID,
          collection,
          documentId
        );
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Document deleted successfully'
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

      default:
        return new Response(JSON.stringify({
          success: false,
          error: `Invalid action: ${action}. Supported actions: list, get, create, update, delete`
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

  } catch (error) {
    console.error('AppWrite sync error:', error);
    
    // Handle specific AppWrite errors
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.code) {
      switch (error.code) {
        case 401:
          errorMessage = 'Unauthorized: Invalid API key or insufficient permissions';
          statusCode = 401;
          break;
        case 404:
          errorMessage = 'Resource not found: Check database ID, collection ID, or document ID';
          statusCode = 404;
          break;
        case 400:
          errorMessage = 'Bad request: Invalid parameters or data format';
          statusCode = 400;
          break;
      }
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      details: error.message || 'Unknown error occurred'
    }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
});