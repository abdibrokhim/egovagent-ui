import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { aiAgent } from "./agent";
import { parseAiAgentResponse } from "./helper";

// Initialize Pinecone client
const pineconeApiKey = process.env.MY_PINECONE_API_KEY as string;
const pc = new Pinecone({ apiKey: pineconeApiKey });

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function POST(request: Request) {
  try {
    // Get the index name from the request body
    const requestBody = await request.json();
    const indexName = requestBody.indexName;
    const query = requestBody.q; // example: Deputy Minister of Tourism and Sports phone number

    if (!indexName) {
      return NextResponse.json(
        { error: 'Index name is required' },
        { status: 400 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    console.log('Received search query:', query);
    console.log('Using Pinecone index:', indexName);

    // Generate embeddings for the query using OpenAI
    const embeddingsResponse = await openaiClient.embeddings.create({
      input: query,
      model: "text-embedding-ada-002"
    });

    const queryEmbedding = embeddingsResponse.data[0].embedding;
    console.log('Query embedding:', queryEmbedding);

    // Get Pinecone index reference
    const index = pc.Index(indexName).namespace(indexName);
    console.log('Querying Pinecone index:', indexName);

    // Query Pinecone index
    const results = await index.query({
      vector: queryEmbedding,
      topK: 1,
      includeMetadata: true,
      includeValues: false
    });

    console.log('Search results:', results);

    // let's save into .json file.
    // const fs = require('fs');
    // fs.writeFileSync('search-results.json', JSON.stringify(results, null, 2));

    // Pass the search results to the AI agent
    const aiResponse = await aiAgent(results, query);
    console.log('AI response:', aiResponse);

    // Parse the AI agent response
    const parsedResponse = parseAiAgentResponse(aiResponse);
    console.log('Parsed response:', parsedResponse);

    // Return the parsed response
    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error('Error in /api/search:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}