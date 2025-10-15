// eslint.config.js
//
// Назначение:
// - Единые правила для JS/TS в режиме NodeNext + ESM.
// - Быстрый lint без типов для всех файлов + строгий type-checked lint для src и tests.
// - Совместимость с Prettier (отключаем конфликтующие правила).
// - Учитывает среду Node и глобальные переменные тестового окружения (Jest).
//
// Как это читать:
// - Каждый элемент массива — отдельный фрагмент конфигурации. Порядок важен.
// - Сначала игнорируем мусор и артефакты, потом включаем JS, затем TS,
//   затем TS с типами, затем правила для тестов, общие опции линтера,
//   и в самом конце — интеграция с Prettier.
//
// Полезные ссылки:
// - ESLint Flat Config: https://eslint.org/docs/latest/use/configure/configuration-files-new
// - typescript-eslint (Flat): https://typescript-eslint.io/getting-started/typed-linting
// - eslint-config-prettier (Flat): https://github.com/prettier/eslint-config-prettier

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname для parserOptions.tsconfigRootDir в ESM-среде
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
    // ============================================================================
    // 1) ГЛОБАЛЬНЫЕ ИСКЛЮЧЕНИЯ
    //    Файлы/папки, которые анализировать смысла нет.
    // ============================================================================
    {
        ignores: [
            'dist',
            'coverage',
            'site',
            'docs',
            'node_modules',
            '.turbo',
            '.next',
            '.cache',
            '**/*.d.ts',
            '**/*.min.js',
            '**/*.map',
            '.tsbuildinfo',
        ],
    },

    // ============================================================================
    // 2) JAVASCRIPT (JS/CJS/MJS) — БАЗА БЕЗ TS
    //    Рекомендуемые правила + современный синтаксис, глобальные имена Node.
    // ============================================================================
    {
        ...js.configs.recommended,
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            ...js.configs.recommended.languageOptions,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            // Чуть меньше шума в черновых ветках
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            // Базовая гигиена
            'no-useless-return': 'warn',
            'no-var': 'error',
            'prefer-const': ['error', { destructuring: 'all' }],
        },
    },

    // ============================================================================
    // 3) TYPESCRIPT — БЫСТРЫЙ ПРОХОД (БЕЗ ТИПОВ)
    //    Подключаем recommended для всех *.ts/*.tsx без проектного анализа.
    //    Этот блок отдаёт быстрый, недорогой по времени эффект.
    // ============================================================================
    ...tseslint.configs.recommended.map((cfg) => ({
        ...cfg,
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ...cfg.languageOptions,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...cfg.rules,
            // Единый стиль импортов типов
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],
            // Менее раздражающая подсветка временных переменных/аргументов
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            // Ровная работа с Promise в «быстром» режиме (строгость ниже)
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
        },
    })),

    // ============================================================================
    // 4) TYPESCRIPT — TYPE-CHECKED РЕКОМЕНДУЕМЫЕ
    //    Строгий проход по src и tests с проектным анализом типов.
    //    Важно: корректный путь к tsconfig.json.
    // ============================================================================
    ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
        ...cfg,
        files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
        languageOptions: {
            ...cfg.languageOptions,
            parserOptions: {
                ...cfg.languageOptions?.parserOptions,
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            ...cfg.rules,
            // В строгом режиме следим за обращением с Promise
            '@typescript-eslint/no-floating-promises': [
                'error',
                { ignoreVoid: true },
            ],
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: { attributes: false },
                    checksConditionals: true,
                },
            ],
            // Чуть более строгий стиль
            '@typescript-eslint/explicit-function-return-type': [
                'warn',
                { allowExpressions: true, allowHigherOrderFunctions: true },
            ],
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
            ],
        },
    })),

    // ============================================================================
    // 5) TYPESCRIPT — СТИЛЬ (TYPE-CHECKED, ОПЦИОНАЛЬНО БОЛЕЕ ЖЁСТКО)
    //    Дополнительная косметика, которая полирует API и сигнатуры.
    // ============================================================================
    ...tseslint.configs.stylisticTypeChecked.map((cfg) => ({
        ...cfg,
        files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
        languageOptions: {
            ...cfg.languageOptions,
            parserOptions: {
                ...cfg.languageOptions?.parserOptions,
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            ...cfg.rules,
            '@typescript-eslint/array-type': [
                'error',
                { default: 'generic', readonly: 'generic' },
            ],
            '@typescript-eslint/method-signature-style': ['error', 'property'],
            '@typescript-eslint/no-useless-empty-export': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': [
                'warn',
                { ignoreConditionalTests: true, ignoreTernaryTests: true },
            ],
            '@typescript-eslint/prefer-optional-chain': 'warn',
        },
    })),

    // ============================================================================
    // 6) ТЕСТЫ — ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ JEST
    //    Без отдельного плагина: объявляем имена окружения, чтобы не было ложных ошибок.
    // ============================================================================
    {
        files: ['tests/**/*.{ts,tsx,js,mjs,cjs}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            // В тестах console часто осознанный выбор
            'no-console': 'off',
            // Заодно не ругаемся на dev-зависимости в тестах (если решите добавить import-правила)
        },
    },

    // ============================================================================
    // 7) ОБЩИЕ НАСТРОЙКИ ЛИНТЕРА
    //    Сообщать, если встречаются неиспользованные // eslint-disable.
    // ============================================================================
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },

    // ============================================================================
    // 8) ИНТЕГРАЦИЯ С PRETTIER (ДОЛЖНА ИДТИ ПОСЛЕДНЕЙ)
    //    Отключает правила, конфликтующие с форматированием Prettier.
    // ============================================================================
    prettier,
];
