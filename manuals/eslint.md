---
title: Подробная настройка ESLint
group: Руководства
category: Guides
---

# Руководство по настройке **ESLint**

**Назначение:** пошаговая инструкция по адаптации линтинга под проект на базе
`ts-template-project`. Инструменты уже установлены; осталось подстроить
конфигурацию, правила и интеграции.

> Используется **ESLint 9 (Flat Config, ESM)** и стек `typescript-eslint`.
> Конфигурация согласована с Prettier и ESM/NodeNext.

---

## 1. Что вы получите

- Единые правила качества для **TypeScript** и **JavaScript**.
- Анализ с учётом типов там, где он действительно полезен
  (`recommendedTypeChecked`, `stylisticTypeChecked`).
- Корректную работу псевдонимов импорта из `tsconfig` (в тестах — через
  `ts-jest-resolver`, в линтере — импорты не ломаются).
- Совместимость с Prettier: форматирование и линтинг не конфликтуют.
- Готовые скрипты для CLI/CI и советы для монорепозитория.

---

## 2. Какие файлы редактировать

```
eslint.config.js      # основной ESM-конфиг (Flat)
tsconfig.json         # IDE/разработка (parserOptions.project смотрит сюда)
tsconfig.base.json    # общие опции TS и псевдонимы импортов
package.json          # скрипты "lint", "lint:fix"
```

---

## 3. Минимальный сценарий

1. Проверьте `ignores` и паттерны `files` в `eslint.config.js`.
2. Убедитесь, что `parserOptions.project` указывает на ваш `tsconfig.json`.
3. При необходимости отрегулируйте правила (`rules`).
4. Запустите:

```bash
npm run lint
npm run lint:fix
```

---

## 4. Рекомендуемая конфигурация `eslint.config.js` (Flat, ESM)

```js
// eslint.config.js (ESM, Flat Config)
//
// Назначение: единые правила анализа кода для JS/TS (NodeNext + ESM) с
// анализом с учётом типов для исходников и тестов. Совместимо с Prettier.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
    // 1) Глобальные исключения
    {
        ignores: [
            'dist',
            'docs',
            'coverage',
            'site',
            'node_modules',
            '.tsbuildinfo',
            '**/*.d.ts',
            '**/*.min.js',
            '**/*.map',
        ],
    },

    // 2) JavaScript (без TS-плагина)
    {
        ...js.configs.recommended,
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            ...js.configs.recommended.languageOptions,
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node },
        },
        rules: {
            ...js.configs.recommended.rules,
            // пример: 'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-useless-return': 'warn',
            'no-var': 'error',
            'prefer-const': ['error', { destructuring: 'all' }],
        },
    },

    // 3) TypeScript — быстрый проход (без проектного анализа типов)
    ...tseslint.configs.recommended.map((cfg) => ({
        ...cfg,
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ...cfg.languageOptions,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.node },
        },
        rules: {
            ...cfg.rules,
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            // строгие проверки промисов включаем ниже, в секции с учётом типов
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
        },
    })),

    // 4) TypeScript — рекомендуемые правила с учётом типов
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

    // 5) TypeScript — стилистические правила (с учётом типов)
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

    // 6) Тесты — глобальные переменные Jest (без плагина)
    {
        files: ['tests/**/*.{ts,tsx,js,mjs,cjs}'],
        languageOptions: { globals: { ...globals.node, ...globals.jest } },
        rules: {
            'no-console': 'off', // в тестах это часто осознанно
        },
    },

    // 7) Общие опции линтера
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },

    // 8) Интеграция с Prettier (должна идти последней)
    prettier,
];
```

Что чаще правят под проект:

- `ignores` и `files` по вашей структуре.
- `parserOptions.project` — путь к актуальному `tsconfig.json`.
- Блоки `rules` — внутри соответствующих секций.

---

## 5. Согласование с TypeScript

- В `tsconfig.base.json`:
    - `module: "NodeNext"`, `moduleResolution: "NodeNext"`,
      `moduleDetection: "force"`;
    - строгие проверки (`strict: true` и сопутствующие флаги);
    - псевдонимы `paths` вроде `"@/*": ["src/*"]`.

- В `tsconfig.json` (IDE): при необходимости включите `types` →
  `["node", "jest"]`, используйте `noEmit: true` и `sourceMap: true`.

---

## 6. Интеграция с Prettier

`eslint-config-prettier` подключён последним, чтобы отключить конфликтующие с
форматированием правила. Форматирование выполняйте отдельной командой
(`prettier -w .`) или через `lint-staged`. Не объединяйте автоматические
исправления ESLint и форматирование в один шаг сохранения.

---

## 7. VS Code

```json
{
    "eslint.useFlatConfig": true,
    "eslint.workingDirectories": [{ "mode": "auto" }],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "eslint.format.enable": false
}
```

Назначьте Prettier как форматтер по умолчанию, если форматируете при сохранении.

---

## 8. lint-staged (pre-commit)

```js
// .lintstagedrc.mjs
export default {
    ignore: ['dist/**', 'build/**', 'coverage/**', 'docs/**'],
    'src/**/*.{ts,tsx}': [
        'eslint --fix --cache --no-warn-ignored --max-warnings=0',
    ],
    'tests/**/*.{ts,tsx,js,cjs,mjs}': [
        'eslint --fix --cache --no-warn-ignored --max-warnings=0',
    ],
};
```

Хук Husky:

```sh
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

---

## 9. Часто настраиваемые правила

```js
rules: {
  '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
  ],
  // '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'no-public' }],
  // мягкие подсказки по nullish/optional:
  // '@typescript-eslint/prefer-nullish-coalescing': 'warn',
  // '@typescript-eslint/prefer-optional-chain': 'warn'
}
```

---

## 10. Скрипты в `package.json`

```jsonc
{
    "scripts": {
        "lint": "eslint . --cache",
        "lint:fix": "eslint . --fix --cache",
        "lint:strict": "eslint . --max-warnings=0",
    },
}
```

`--cache` заметно ускоряет повторные прогоны.

---

## 11. CI и PR

Минимальный пайплайн:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Строгий режим: добавьте `lint:strict`, чтобы считать предупреждения ошибками.

---

## 12. Диагностика

**Parsing error: Cannot read file 'tsconfig.json'** Проверьте
`parserOptions.project` и `tsconfigRootDir`.

**Импорты с '@/…' не разрешаются** Согласуйте `tsconfig.base.json: paths` и (при
необходимости) подключите `eslint-plugin-import` +
`eslint-import-resolver-typescript` для правил импорта. В тестах псевдонимы
обрабатывает `ts-jest-resolver` через `moduleNameMapper`.

**Конфликты форматирования** Убедитесь, что блок `prettier` — последний в
конфиге, и не запускайте Prettier через `eslint --fix`.

---

## 13. Монорепозиторий

- Корневой Flat-конфиг плюс пакетные Flat-конфиги там, где правила различаются.
- В VS Code включите `"eslint.workingDirectories": [{ "mode": "auto" }]`.
- Для проектных ссылок TypeScript используйте `composite: true`, а в линтере
  указывайте соответствующий `parserOptions.project` на пакетный
  `tsconfig.json`.

---

## 14. Контрольный список

- [ ] Обновлён `eslint.config.js`: списки исключений, `files`,
      `parserOptions.project`.
- [ ] Подключён `prettier` последним.
- [ ] Для тестов заданы глобальные переменные Jest.
- [ ] Скрипты `lint`/`lint:fix` работают локально и в CI.
- [ ] Дополнительные правила отражают стандарты команды.
