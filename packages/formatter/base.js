/**
 * @type {import("prettier").Config}
 */
export const baseConfig = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  bracketSpacing: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
}
