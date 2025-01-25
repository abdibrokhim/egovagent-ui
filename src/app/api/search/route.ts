// import { NextResponse } from 'next/server';
// import EmbeddingResponse from "openai";
// // import { Pinecone }, ServerlessSpec from "pinecone";

// // Initialize Pinecone client
// const pineconeApiKey = process.env.MY_PINECONE_API_KEY as string;
// const pc = new Pinecone({ apiKey: pineconeApiKey });

// // Initialize OpenAI client
// import openai from 'openai';
// openai.api_key = process.env.OPENAI_API_KEY as string;

// // Define Pinecone index name
// const indexName = "607ff4227b6428eee08802c0";

// export async function GET(request: Request) {
//   try {
//     // Get the search query from URL params
//     const { searchParams } = new URL(request.url);
//     const query = searchParams.get('q');

//     if (!query) {
//       return NextResponse.json(
//         { error: 'Search query is required' },
//         { status: 400 }
//       );
//     }

//     // Generate embeddings for the query using OpenAI
//     const embeddingsResponse = await openai.Embeddings.create({
//       input: query,
//       model: "text-embedding-ada-002"
//     }) as EmbeddingResponse;

//     const queryEmbedding = embeddingsResponse.data[0].embedding;

//     // Query Pinecone index
//     const results = await pc.query({
//       indexName: indexName,
//       vector: queryEmbedding,
//       topK: 2,
//       includeMetadata: true
//     });

//     return NextResponse.json(results);

//   } catch (error: any) {
//     console.error('Error in /api/search:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
