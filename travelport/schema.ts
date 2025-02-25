import { createSchema } from 'graphql-yoga'
import { TravelPortClient } from './client'

// Define the context type
type YogaContext = {
    client: typeof TravelPortClient
}

export const schema = createSchema<YogaContext>({
    typeDefs: /* GraphQL */ `
    type Query {
      hello: String
    }
  `,
    resolvers: {
        Query: {
            hello: (parent,args,context) => {
                // Now context is properly typed with client
                return 'world'
            }
        }
    }
})