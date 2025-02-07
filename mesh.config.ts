import {
  createPrefixTransform,
  defineConfig,
  loadGraphQLHTTPSubgraph
} from '@graphql-mesh/compose-cli'
import { loadJSONSchemaSubgraph } from '@omnigraph/json-schema'


export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadGraphQLHTTPSubgraph('Countries',{
        endpoint: 'https://countries.trevorblades.com'
      }),
      transforms: [
        createPrefixTransform({
          value: 'Countries_'
        })
      ]
    }
  ]
})