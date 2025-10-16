---
title: Подробная настройка Jest
group: Руководства
category: Guides
---

---

# Руководство по настройке **Jest**

**Назначение:** пошаговая инструкция для адаптации модульных тестов под проект
на базе `ts-template-project`. Все зависимости уже добавлены; требуется
согласовать конфигурацию, пути, пресеты и покрытие.

---

## 1. Что вы получите

- Запуск тестов в Node.js с поддержкой **ESM** и **TypeScript**.
- Корректную работу псевдонимов импорта `@/…` и спецификаторов с суффиксом `.js`
  в режиме **NodeNext**.
- Быстрые повторные прогоны, контролируемое покрытие, стабильные отчёты.

---

## 2. Какие файлы менять

Обычно достаточно отредактировать:

```
jest.config.js          # основные настройки Jest (ESM)
tsconfig.base.json      # псевдонимы/paths (должны соответствовать moduleNameMapper)
tsconfig.json           # типы 'jest' для IDE/разработки (по ситуации)
package.json            # скрипты 'test'/'test:watch'/'test:ci'
```

> В шаблоне уже присутствуют `jest`, `ts-jest`, `ts-jest-resolver`.

---

## 3. Минимальный сценарий

1. Проверьте `roots` и `testMatch` под вашу структуру.
2. Синхронизируйте `moduleNameMapper` с `compilerOptions.paths`.
3. Установите `testEnvironment` (`node` или `jsdom`).
4. Запустите тесты:

```bash
npm test
# или
npm run test:watch
```

---

## 4. Рекомендуемая конфигурация `jest.config.js` (ESM + TypeScript)

```js
// jest.config.js

/**
 * JEST CONFIG (ESM + TypeScript)
 * • Запуск модульных тестов в Node.js с поддержкой ESM и TypeScript.
 * • Корректное разрешение "@/..." и спецификаторов с ".js" (NodeNext).
 * • Повторяемые прогоны: сброс имитаций, явные паттерны поиска.
 */
const config = {
    // 1) БАЗОВОЕ ПОВЕДЕНИЕ
    bail: 1,
    clearMocks: true,
    // resetMocks: true, // включайте при необходимости полного сброса между кейсами
    verbose: true,
    rootDir: '.',
    testEnvironment: 'node',
    testTimeout: 10_000,
    watchPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/.tsbuildinfo'],

    // 2) ОБЛАСТЬ ПОИСКА ТЕСТОВ
    roots: ['<rootDir>/tests'],
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],

    // 3) TYPESCRIPT + ESM
    preset: 'ts-jest/presets/default-esm',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: '<rootDir>/tsconfig.json',
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'],

    // 4) РАЗРЕШЕНИЕ МОДУЛЕЙ И ПСЕВДОНИМЫ
    resolver: 'ts-jest-resolver',
    moduleNameMapper: {
        '^@/(.*)\\.js$': '<rootDir>/src/$1.ts',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^tests/(.*)\\.js$': '<rootDir>/tests/$1.ts',
        '^tests/(.*)$': '<rootDir>/tests/$1',
        // Сохраняем относительные импорты с .js как есть (совместимость с NodeNext)
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    // 5) ПОКРЫТИЕ
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx}',
        '!<rootDir>/src/**/*.d.ts',
    ],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageProvider: 'v8',
};

export default config;
```

> Конфиг согласован с `tsconfig.base.json` (режим NodeNext и псевдоним `@/*`).

---

## 5. Что обычно меняют

- **`roots`** — где искать тесты. Пример:
  `['<rootDir>/tests', '<rootDir>/packages/*/tests']`.
- **`testMatch`** — шаблоны тестовых файлов:
  `['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts']`.
- **`testEnvironment`** — `node` или `jsdom` (для DOM-тестов).
- **`moduleNameMapper`** — синхронизируйте с `tsconfig.base.json: paths`.
- **`collectCoverageFrom`** — что покрываем. Исключите генерируемые
  файлы/реэкспорты.

---

## 6. Интеграция с TypeScript

- В `tsconfig.base.json`:
    - `module: "NodeNext"`, `moduleResolution: "NodeNext"`,
      `moduleDetection: "force"`;
    - псевдоним `@/*` должен указывать на `src/*`.
    - предупреждение `ts-jest` про `isolatedModules` исправляется включением
      опции **в tsconfig**:

        ```jsonc
        { "compilerOptions": { "isolatedModules": true } }
        ```

- В `tsconfig.json` (IDE) при необходимости добавьте типы `jest`:

    ```jsonc
    {
        "extends": "./tsconfig.base.json",
        "compilerOptions": {
            "noEmit": true,
            "sourceMap": true,
            "allowImportingTsExtensions": true,
            "types": ["node", "jest"],
        },
        "include": ["src", "tests"],
    }
    ```

- `ts-jest`:
    - используйте пресет `ts-jest/presets/default-esm` и `useESM: true`;
    - `ts-jest-resolver` учтёт `compilerOptions.paths`.

---

## 7. NodeNext и спецификаторы `.js`

В режиме NodeNext исходники часто импортируются как
`import x from '@/foo/bar.js'`, хотя файл — `bar.ts`. В `moduleNameMapper`
добавлены правила, сопоставляющие `.js` с `.ts` для тестового окружения.
Относительные импорты с `.js` также сохраняются как есть:
`'^(\\.{1,2}/.*)\\.js$': '$1'`.

---

## 8. Подготовительные файлы и имитации

Общая инициализация перед кейсами (таймеры, расширения `expect`, полифилы):

```ts
// tests/jest.setup.ts
// import '@testing-library/jest-dom/extend-expect'; // для jsdom-проектов
jest.useFakeTimers();
```

Подключение:

```js
// jest.config.js
const config = {
    // ...
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
};
```

`clearMocks: true` очищает шпионы между тестами. Для полного сброса состояния
используйте `resetMocks: true` (медленнее, но чище).

---

## 9. Покрытие кода

- Базовая настройка уже включена: `collectCoverage: true`, провайдер `v8`.

- Порог можно зафиксировать через `coverageThreshold`:

    ```js
    coverageThreshold: {
      global: { branches: 80, functions: 85, lines: 90, statements: 90 }
    }
    ```

- Если отчёты нестабильны, проверьте, не попадают ли в покрытие файлы-реэкспорты
  или индексы.

---

## 10. Скрипты в `package.json`

Быстрый старт:

```jsonc
{
    "scripts": {
        "test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js",
        "test:watch": "npm run test -- --watch",
        "test:ci": "npm test -- --ci --coverage --runInBand",
        "test:changed": "npm test -- --onlyChanged",
    },
}
```

`--runInBand` в CI снижает риск нестабильных прогонов на слабых агентах.

---

## 11. Производительность и стабильность

- Уменьшайте «шум» в watch-режиме через `watchPathIgnorePatterns`.
- Долгие интеграционные кейсы — выделяйте отдельным скриптом и запускайте с
  `--runInBand`.
- Явно освобождайте ресурсы (сокеты, таймеры) в `afterEach/afterAll`.
- Если тесты «залипают», временно увеличьте `testTimeout` и включите
  `--detectOpenHandles` для диагностики.

---

## 12. Диагностика: частые симптомы и решения

**`Cannot use import statement outside a module`** Проверьте:

- пресет `ts-jest/presets/default-esm`;
- `useESM: true` в `transform`;
- `extensionsToTreatAsEsm: ['.ts']`;
- запуск через `--experimental-vm-modules`.

**`Cannot find module '@/...'`** Проверьте соответствие
`tsconfig.base.json: paths` ↔ `moduleNameMapper` и наличие `ts-jest-resolver`.

**`Unknown file extension ".ts"`** Неверный режим модулей. Проверьте ESM-запуск,
пресет и `extensionsToTreatAsEsm`.

**Тесты зависают** Увеличьте `testTimeout`, очищайте таймеры-имитации, смотрите
«висящие» дескрипторы через `--detectOpenHandles` (временно).

---

## 13. Советы для монорепозитория

- Держите локальные `jest.config.js` в пакетах с разными средами (`node/jsdom`).
- В корне используйте агрегацию (`pnpm -r test` и т. п.).
- Следите, чтобы `paths`/`moduleNameMapper` каждого пакета совпадали.

---

## 14. Контрольный список

- [ ] Проверены `roots`, `testMatch`, `testEnvironment`.
- [ ] Согласованы псевдонимы: `tsconfig.base.json` ↔ `moduleNameMapper`.
- [ ] Включён ESM-контур: `preset`, `useESM`, `extensionsToTreatAsEsm`.
- [ ] Настроено покрытие: `collectCoverageFrom`, `coverageProvider`.
- [ ] (По необходимости) подключены `setupFilesAfterEnv`.
- [ ] Скрипты `test`/`test:watch`/`test:ci` работают локально и в CI.
