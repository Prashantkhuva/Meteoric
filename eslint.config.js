import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'out', '.next', 'middleware-snapshot.js']),
  {
    files: ['middleware.js'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['middleware.js'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['app/**/*.jsx', 'src/Components/ui/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
