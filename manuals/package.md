---
title: Подробная настройка package.json
group: Руководства
category: Guides
---

# Руководство по настройке **package.json**

**Назначение:** пошаговая инструкция по настройке метаданных, точек входа и
сценариев публикации для проектов на базе `ts-template-project`. Инструменты уже
подключены; ваша задача — корректно заполнить поля `package.json`, чтобы сборка,
типы, публикация и документация работали предсказуемо.

---

## 1) Цели и состав

**Цели:**

- корректная идентификация пакета и ссылки;
- явная ESM-ориентация и согласованные точки входа;
- стабильные пути к артефактам (`dist/`) и типам (`.d.ts`);
- минимальная поверхность публикации (`files`), безопасный `sideEffects`;
- удобные сценарии в `scripts`.

**Рекомендуемая структура:**

```
.
├─ src/                 # исходный код
├─ dist/                # артефакты сборки (tsc)
├─ tests/               # модульные тесты
├─ package.json         # конфигурация пакета (строгий JSON)
└─ package.jsonc        # (необязательно) копия с комментариями для людей
```

> Публикуется и читается только `package.json`. Если храните `package.jsonc`, не
> забывайте синхронизировать его с реальным файлом.

---

## 2) Минимальный чек-лист изменений

1. Заполните **идентификацию**: `name`, `version`, `description`, `keywords`,
   `license`, `author`, `repository`, `homepage`, `bugs`.
2. Уточните **среду**: `"type": "module"`, `engines.node`, при необходимости
   `packageManager`.
3. Проверьте **точки входа** и типы: `main`, `types`, `exports`.
4. Ограничьте набор публикуемых файлов: `files`.
5. Согласуйте **scripts** с вашим процессом (build/test/release).
6. Проверьте `sideEffects` (обычно `false` для библиотек без автокода).
7. Для scoped пакетов задайте `publishConfig.access`.

---

## 3) Базовый шаблон (ESM библиотека)

```jsonc
{
    "name": "@your-scope/your-package",
    "version": "0.1.0",
    "description": "Краткое описание библиотеки (одна строка).",
    "keywords": ["typescript", "library", "esm"],
    "license": "MIT",

    "author": {
        "name": "Your Name",
        "email": "your@email",
        "url": "https://github.com/your",
    },

    "homepage": "https://github.com/your/your-repo#readme",
    "bugs": "https://github.com/your/your-repo/issues",
    "repository": {
        "type": "git",
        "url": "git+https://github.com/your/your-repo.git",
    },

    "type": "module",
    "engines": { "node": ">=18" },
    "packageManager": "npm@10",

    "sideEffects": false,
    "files": ["dist", "CHANGELOG.md", "README.md", "LICENSE"],

    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",

    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.js",
            "default": "./dist/index.js",
        },
        "./package.json": "./package.json",
    },

    "scripts": {
        "prepublishOnly": "npm test && npm run build",
        "build": "npm run src:build && npm run docs:build",
        "clean": "npm run src:clean && npm run docs:clean",

        "src:clean": "rimraf dist .tsbuildinfo",
        "src:build": "npm run src:clean && tsc -p tsconfig.build.json",

        "docs:clean": "rimraf docs",
        "docs:build": "typedoc --options typedoc.config.js",

        "test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js",
        "test:watch": "npm run test -- --watch",
        "test:ci": "npm test -- --ci --coverage",

        "typecheck": "tsc -p tsconfig.json --noEmit",

        "lint": "eslint .",
        "lint:fix": "eslint . --fix",

        "format": "prettier -w .",
        "format:check": "prettier -c .",

        "release": "standard-version --config .versionrc.cjs",
        "release:patch": "standard-version --release-as patch --config .versionrc.cjs",
        "release:minor": "standard-version --release-as minor --config .versionrc.cjs",
        "release:major": "standard-version --release-as major --config .versionrc.cjs",
        "postrelease": "git push --follow-tags origin main",
    },

    "publishConfig": { "access": "public" },
}
```

---

## 4) Пояснения к ключевым полям

### 4.1 Идентификация и ссылки

- `name` — уникально. Для публичных пакетов под организацией: `@org/name`.
- `version` — SemVer. Рекомендуется автоматизировать через `standard-version`.
- `license` — SPDX и файл `LICENSE` в корне.
- `repository`, `bugs`, `homepage` — корректные URL ускоряют навигацию
  пользователям.

### 4.2 Среда выполнения

- `"type": "module"` фиксирует ESM по умолчанию. Для CJS используйте `.cjs`.
- `engines.node` синхронизируйте с используемыми возможностями платформы и
  зависимостями.
- `packageManager` закрепляет менеджер и версию для CI и локальной
  согласованности.

### 4.3 Поверхность пакета

- `files` — белый список публикуемого. Держите пакет минимальным.
- `sideEffects: false` — безопасно, если модули не выполняют код «на импорт».
  Если есть такие файлы, укажите маски, а не весь пакет.

### 4.4 Точки входа и типы

- `main` и `types` должны указывать на артефакты из `dist/`.
- `exports` формирует публичный API. Минимум — корень `"."` и `./package.json`.
- Подпути экспортируйте только при необходимости и только стабильные:

```jsonc
"exports": {
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
  "./utils": { "types": "./dist/utils/index.d.ts", "import": "./dist/utils/index.js" },
  "./package.json": "./package.json"
}
```

---

## 5) Скрипты: назначение и быстрые команды

- **Сборка:** `src:build` → `dist/`.
- **Документация:** `docs:build` собирает TypeDoc (см. `typedoc.config.js`).
- **Проверки:** `typecheck`, `lint`, `format:check`, `test`, `test:ci`.
- **Релизы:** `release:*` генерируют `CHANGELOG`, коммит и тег.
- **Публикация:** `prepublishOnly` защитит от публикации без зелёных
  тестов/сборки.

---

## 6) Валидация перед релизом

1. Сборка:

```bash
npm run build
```

2. Предпросмотр публикуемого состава:

```bash
npm pack --dry-run
```

Убедитесь, что архив содержит только файлы из `files`.

3. Проверка импортов и типов: установите пакет в временный проект или сделайте
   `link` и проверьте автодополнение/типизацию.

---

## 7) Частые варианты конфигурации

- **Публичная публикация под scope:** `"publishConfig": { "access": "public" }`.
- **Доп. поля:** `funding`, `typesVersions` (редко нужно), `packageManager`.
- **Гибрид ESM/CJS:** потребует отдельной сборки CJS и условных экспортов
  (`"require"`/`"import"`), что выходит за рамки минимальной настройки.

---

## 8) CI-проверки (минимум)

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run format:check
npm pack --dry-run
```

---

## 9) Контрольный список

- [ ] Заполнены `name`, `version`, `description`, `keywords`, `license`,
      `author`.
- [ ] Указаны `homepage`, `bugs`, `repository`.
- [ ] Подтверждены `type: "module"` и `engines.node`.
- [ ] Согласованы `main`, `types`, `exports`, `files`.
- [ ] `sideEffects` отражает реальность (или `false`).
- [ ] `scripts` соответствуют вашему процессу.
- [ ] `publishConfig.access` корректен для вашего scope.
- [ ] `npm pack --dry-run` показывает ожидаемый состав.
- [ ] Сборка и тесты проходят.
