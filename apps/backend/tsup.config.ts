import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['api/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node22',
  shims: true,
  clean: true,
})
