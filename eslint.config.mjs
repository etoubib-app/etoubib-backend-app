// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      unicorn,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-call': 'off',
      // 'import/order': [
      //   'error',
      //   {
      //     groups: [
      //       ['builtin', 'external'], // Node.js built-ins and third-party packages
      //       ['internal'], // Internal project imports (@lib/shared)
      //       ['parent', 'sibling', 'index'], // Relative imports
      //     ],
      //     'newlines-between': 'always-and-inside-groups', // Keeps groups together but adds space between third-party/internal and relative imports
      //     alphabetize: { order: 'asc', caseInsensitive: true },
      //   },
      // ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { args: 'after-used', vars: 'all' },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unicorn/prevent-abbreviations': 'error',
      'unicorn/no-array-reduce': 'warn',
      'unicorn/no-array-for-each': 'warn',
    },
  },
);
