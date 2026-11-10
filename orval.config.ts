import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: process.env.ORVAL_OPENAPI_SOURCE ?? './openapi/openapi.yaml'
    },
    output: {
      baseUrl: {
        runtime: 'env.API_BASE_URL',
        imports: [
          {
            name: 'env',
            importPath: '@/shared/config/env'
          }
        ]
      },
      clean: true,
      client: 'react-query',
      formatter: 'prettier',
      httpClient: 'axios',
      mode: 'tags-operations',
      indexFiles: true,
      override: {
        mutator: {
          path: './src/shared/api/mutator/custom-axios.ts',
          name: 'customAxios'
        }
      },
      schemas: {
        path: './src/shared/api/generated/model',
        splitByTags: true
      },
      target: './src/shared/api/generated/operations'
    }
  }
})
