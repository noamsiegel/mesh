// This file loads environment variables for local development
// In production, these will be set in the Cloudflare Workers dashboard

// For local development with Bun
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    console.warn('dotenv not found, skipping .env file loading');
  }
}

// Export environment variables for TypeScript
export const ENV = {
  TRAVELPORT_PROD_CLIENT_ID: process.env.TRAVELPORT_PROD_CLIENT_ID,
  TRAVELPORT_PROD_CLIENT_SECRET: process.env.TRAVELPORT_PROD_CLIENT_SECRET,
  TRAVELPORT_PROD_OAUTH_URL: process.env.TRAVELPORT_PROD_OAUTH_URL,
  TRAVELPORT_PROD_USERNAME: process.env.TRAVELPORT_PROD_USERNAME,
  TRAVELPORT_PROD_PASSWORD: process.env.TRAVELPORT_PROD_PASSWORD,
  TRAVELPORT_PROD_ACCESS_GROUP: process.env.TRAVELPORT_PROD_ACCESS_GROUP,
}; 