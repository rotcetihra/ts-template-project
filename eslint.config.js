// eslint.config.js (ESM, flat)
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
    // Базовые правила JS (flat)
    js.configs.recommended,

    // Рекомендованные правила для TS с type-check (flat)
    ...tseslint.configs.recommendedTypeChecked,

    // Общие настройки проекта
    {
        name: 'project:base',
        ignores: [
            'eslint.config.js',
            'dist',
            'docs',
            'coverage',
            'site',
            'node_modules',
            '**/*.d.ts',
        ],
    },

    // TS-файлы проекта
    {
        name: 'project:ts',
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.build.json'],
                tsconfigRootDir,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports' },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },

    // Тесты (Jest)
    {
        name: 'project:tests',
        files: ['tests/**/*.ts', 'tests/**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
        },
    },

    // Выключаем правила, конфликтующие с Prettier. НИКАКОГО spread.
    eslintConfigPrettier,
];
