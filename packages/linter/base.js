import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export const baseConfig = defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
])
