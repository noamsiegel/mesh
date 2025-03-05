import { createYoga } from 'graphql-yoga';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';

// Import environment variables
import './loadEnv';

// In production, this will be replaced with the actual schema content during build
// For local development, we'll use a placeholder
const supergraphSchema = process.env.SUPERGRAPH_SCHEMA || `
# This is a placeholder schema
# The actual schema will be injected during build
type Query {
  _placeholder: String
}
`;

// Create a GraphQL yoga server
const yoga = createYoga({
  schema: buildSubgraphSchema({
    typeDefs: parse(supergraphSchema),
    resolvers: {
      // Your resolvers will be handled by the mesh gateway
    }
  }),
  graphiql: true,
  landingPage: false,
  cors: true
});

// Export for Cloudflare Workers
export default {
  fetch: (request: Request, env: any, ctx: any) => {
    // Simple router
    const url = new URL(request.url);
    
    // Health check endpoint
    if (url.pathname === '/') {
      return new Response('GraphQL Mesh Gateway is running! Go to /graphql to use the API.', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    // GraphQL endpoint
    if (url.pathname === '/graphql') {
      // Set environment variables from Cloudflare
      Object.keys(env).forEach(key => {
        process.env[key] = env[key];
      });
      
      return yoga.fetch(request, env, ctx);
    }
    
    // 404 for all other routes
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}; 