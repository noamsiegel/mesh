# GraphQL Mesh Gateway

A GraphQL Mesh Gateway that integrates with TravelPort API and deploys to Cloudflare Workers.

## Prerequisites

- [Bun](https://bun.sh/) package manager
- [Cloudflare Workers account](https://workers.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Create a `.env` file with the following variables:
   ```
   TRAVELPORT_PROD_CLIENT_ID=your_client_id
   TRAVELPORT_PROD_CLIENT_SECRET=your_client_secret
   TRAVELPORT_PROD_OAUTH_URL=your_oauth_url
   TRAVELPORT_PROD_USERNAME=your_username
   TRAVELPORT_PROD_PASSWORD=your_password
   TRAVELPORT_PROD_ACCESS_GROUP=your_access_group
   ```

## Local Development

1. Generate the supergraph schema:
   ```
   bun run generate-supergraph
   ```
2. Start the development server:
   ```
   bun run dev
   ```

## Deployment to Cloudflare Workers

1. Update the `wrangler.toml` file with your Cloudflare account ID and domain information.

2. Login to Cloudflare (if not already logged in):
   ```
   npx wrangler login
   ```

3. Deploy to Cloudflare Workers:
   ```
   bun run deploy
   ```

4. Set up environment variables in the Cloudflare Workers dashboard:
   - Go to your Workers service in the Cloudflare dashboard
   - Navigate to Settings > Variables
   - Add the environment variables from your `.env` file

## Scripts

- `bun run generate-supergraph` - Generate the supergraph schema
- `bun run dev` - Start the development server
- `bun run build` - Build the project
- `bun run deploy` - Deploy to Cloudflare Workers
- `bun run start` - Start the local server (after build) 