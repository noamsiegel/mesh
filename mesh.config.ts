import {
  defineConfig,
} from '@graphql-mesh/compose-cli'
import path from 'path';
import { loadJSONSchemaSubgraph } from '@omnigraph/json-schema';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { TravelPortClient } from './travelport/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fetch the OAuth token (replace with your actual OAuth logic)
async function getTravelportToken(): Promise<string> {
  try {
    // Load environment variables
    const clientId = process.env.TRAVELPORT_PROD_CLIENT_ID!;
    const clientSecret = process.env.TRAVELPORT_PROD_CLIENT_SECRET!;
    const oauthUrl = process.env.TRAVELPORT_PROD_OAUTH_URL!;
    const username = process.env.TRAVELPORT_PROD_USERNAME!;
    const password = process.env.TRAVELPORT_PROD_PASSWORD!;

    console.log('Attempting to fetch OAuth token from:', oauthUrl);
    console.log('Using client ID:', clientId ? '****' : 'MISSING');
    console.log('Using username:', username ? '****' : 'MISSING');

    const oauthPayload = {
      grant_type: 'password',
      username,
      password,
      client_id: clientId,
      client_secret: clientSecret,
    };

    const tokenResponse = await axios.post(oauthUrl, oauthPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (!tokenResponse.data.access_token) {
      throw new Error('No access token received in response');
    }
    
    console.log('Successfully retrieved OAuth token');
    return tokenResponse.data.access_token;
  } catch (error) {
    console.error('Error fetching Travelport token:', error.response?.data || error.message);
    throw error;
  }
}

const travelportToken = await getTravelportToken();
console.log('Travelport token:', travelportToken);

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadJSONSchemaSubgraph('Travelport', {
        endpoint: 'https://api.travelport.com/12/hotel/search/',
        operationHeaders: {
          'Authorization': `Bearer ${travelportToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'XAUTH_TRAVELPORT_ACCESSGROUP': process.env.TRAVELPORT_PROD_ACCESS_GROUP!
        },
				async fetch(url: string, options?: RequestInit) {
					try {
						// Convert the request to a format your client understands
						const requestBody = options?.body ? JSON.parse(options.body.toString()) : {};
						
						// Use the TravelPortClient to make the request
						const response = await TravelPortClient.searchHotels(requestBody);
						
						return new Response(JSON.stringify(response), {
							headers: {
								'Content-Type': 'application/json',
							},
						});
					} catch (error) {
						console.error('Travelport API error:', error);
						throw error;
					}
				},
        operations: [
          {
            type: 'Query',
            field: 'searchHotels',
            path: '/searchcomplete',
            method: 'POST',
            requestTypeName: 'CoordinatesHotelSearchRequest',
            requestSchema: path.join(__dirname, 'travelport', 'models', 'coordinates', 'test_request_schema.json'),
            responseSchema: path.join(__dirname, 'travelport', 'models', 'coordinates', 'response_schema.json'),
					}
        ],
      }),
    },
  ]
})