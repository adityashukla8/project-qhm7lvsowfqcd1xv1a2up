import { Client, Databases, Query } from 'npm:appwrite@15.0.0';

const client = new Client()
  .setEndpoint(Deno.env.get('APPWRITE_ENDPOINT') || 'https://cloud.appwrite.io/v1')
  .setProject(Deno.env.get('APPWRITE_PROJECT_ID') || '')
  .setKey(Deno.env.get('APPWRITE_API_KEY') || '');

const databases = new Databases(client);
const DATABASE_ID = 'patient_info';

Deno.serve(async (req) => {
  try {
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
          error: 'Invalid action'
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

  } catch (error) {
    console.error('AppWrite sync error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});