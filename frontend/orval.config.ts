import { defineConfig } from 'orval';

export default defineConfig({
  taskflow: {
    input: {
      target: 'http://localhost:3000/api-json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/app/core/api/generated',
      schemas: 'src/app/core/api/generated/model',
      client: 'axios-functions',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: 'src/app/core/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
