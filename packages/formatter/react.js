import { baseConfig } from './base.js'

/**
 * @type {import("prettier").Config}
 */
export const reactConfig = {
  ...baseConfig,
  plugins: [
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
}
