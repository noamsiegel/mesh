import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './travelport/schema'
import { TravelPortClient } from './travelport/client'

// Initialize TravelPort client
TravelPortClient.setDebug(process.env.NODE_ENV === 'development')

// Create a Yoga instance with a GraphQL schema and context
const yoga = createYoga({
    schema,
    context: () => ({
        client: TravelPortClient
    })
})

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Start the server and you're done!
server.listen(4000,() => {
    console.info('Server is running on http://localhost:4000/graphql')
})