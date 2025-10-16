---
title: Подробная настройка TypeDoc
group: Руководства
category: Guides
---

# Настройка TypeDoc для проекта

**Цель:** адаптировать преднастроенный TypeDoc под собственную библиотеку.  
Конфигурация уже готова к использованию — нужно только внести ваши данные.

---

## 1. Предварительная структура проекта

Перед настройкой убедитесь, что в проекте есть:

- `typedoc.config.js` — основная конфигурация TypeDoc (см. пример в шаблоне);
- `tsconfig.build.json` — сборочная конфигурация с `declaration: true` и
  `declarationMap: true`;
- `src/index.ts` — входная точка публичного API;
- `README.md` — отображается на главной странице документации;
- `manuals/` — каталог Markdown-руководств (опционально).

---

## 2. Метаданные проекта и выходные файлы

Обновите основные сведения:

```jsonc
{
    "name": "@your-scope/your-library",
    "out": "docs",
    "readme": "README.md",
    "includeVersion": true,
    "cleanOutputDir": true,
    "hideGenerator": true,
    "titleLink": "https://github.com/<org>/<repo>",
}
```

- **name** — отображается в заголовке сайта;
- **titleLink** — переход по клику на логотип (обычно — репозиторий);
- **includeVersion** — берёт версию из `package.json`.

---

## 3. Входные точки и связь с TypeScript

Проверьте настройки для корректного анализа API:

```jsonc
{
    "entryPoints": ["src/index.ts"],
    "entryPointStrategy": "resolve",
    "tsconfig": "tsconfig.build.json",
    "alwaysCreateEntryPointModule": true,
    "useTsLinkResolution": true,
}
```

- **entryPoints** — документируются только экспортированные символы;
- **useTsLinkResolution** — корректно разрешает `{@link}` по правилам
  TypeScript.

---

## 4. Ссылки на исходный код

Добавьте кликабельные ссылки на GitHub:

```jsonc
{
    "gitRevision": "HEAD",
    "sourceLinkTemplate": "https://github.com/<org>/<repo>/blob/{gitRevision}/{path}#L{line}",
    "sourceLinkExternal": true,
    "displayBasePath": "src",
}
```

- **displayBasePath** укорачивает пути в UI;
- **sourceLinkExternal** открывает исходники во внешней вкладке.

---

## 5. Фильтрация и отбор контента

Оставьте в документации только публичные, задокументированные элементы:

```jsonc
{
    "excludeExternals": true,
    "excludePrivate": true,
    "excludeProtected": false,
    "excludeInternal": true,
    "excludeNotDocumented": true,
    "exclude": [
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/__tests__/**",
        "**/__mocks__/**",
        "**/fixtures/**",
        "**/examples/**",
        "**/scripts/**",
    ],
}
```

Если нужно временно показать всё, установите `"excludeNotDocumented": false`.

---

## 6. Навигация и структура

Зафиксируйте порядок категорий и сортировку элементов:

```jsonc
{
    "categorizeByGroup": true,
    "defaultCategory": "Misc",
    "categoryOrder": [
        "Core",
        "Builders",
        "Utils",
        "Types",
        "Experimental",
        "Misc",
    ],
    "sort": ["documents-first", "kind", "alphabetical", "source-order"],
    "navigationLinks": {
        "GitHub": "https://github.com/<org>/<repo>",
    },
}
```

- **documents-first** — руководства (`manuals/`) выше API в навигации;
- **categoryOrder** — определяет порядок разделов в боковом меню.

---

## 7. Тема и плагины

Оформление и поведение интерфейса:

```jsonc
{
    "theme": "typedoc-github-theme",
    "plugin": [
        "typedoc-github-theme",
        "typedoc-plugin-mdn-links",
        "typedoc-plugin-rename-defaults",
    ],
    "visibilityFilters": {
        "protected": false,
        "private": false,
        "inherited": true,
        "external": false,
    },
}
```

---

## 8. Внешние руководства и поиск

Подключите Markdown-файлы из `manuals/` и включите индексацию:

```jsonc
{
    "projectDocuments": ["manuals/*.md"],
    "searchInDocuments": true,
    "searchInComments": true,
}
```

**Фронтматтер** в руководствах помогает задать заголовок и группу:

```md
---
title: Подробная настройка TypeDoc
group: Руководства
category: Guides
---
```

---

## 9. Подсветка синтаксиса

```jsonc
{
    "highlightLanguages": [
        "md",
        "markdown",
        "ts",
        "js",
        "json",
        "jsonc",
        "bash",
        "sh",
        "yaml",
        "yml",
        "text",
    ],
    "lightHighlightTheme": "github-light",
    "darkHighlightTheme": "github-dark",
}
```

---

## 10. Проверки и политика сборки

```jsonc
{
    "validation": {
        "notExported": true,
        "invalidLink": true,
        "notDocumented": true,
    },
    "treatWarningsAsErrors": false,
}
```

Для CI стоит усилить контроль:

```jsonc
{
    "gitRevision": "v1.0.0",
    "treatWarningsAsErrors": true,
}
```

---

## 11. Сборка и просмотр

Добавьте скрипты в `package.json`:

```jsonc
{
    "scripts": {
        "docs:build": "typedoc --options typedoc.config.js",
        "docs:watch": "typedoc --options typedoc.config.js --watch",
        "docs:serve": "npx http-server docs -p 8080 -c-1",
    },
}
```

**Проверка:**

- `npm run docs:build` — генерация документации
- `npm run docs:watch` — режим слежения
- `npm run docs:serve` — локальный предпросмотр

Проверь:

- переходы к исходникам,
- корректность разделов,
- работу поиска,
- подсветку синтаксиса.

---

## 12. Контрольный список

1. Обновить `name`, `titleLink`, `navigationLinks`.
2. Проверить `entryPoints`, `tsconfig`, `useTsLinkResolution`.
3. Настроить `gitRevision` и `sourceLinkTemplate`.
4. Отфильтровать ненужные файлы через `exclude`.
5. Определить категории и порядок.
6. Добавить мануалы и фронтматтер.
7. Проверить тему, плагины и видимость.
8. Настроить подсветку и фильтры поиска.
9. Провести проверку и собрать документацию.

---

Коротко: TypeDoc не требует «магии» — достаточно обновить названия, пути и
политику фильтрации. После этого `npm run docs:build` должен выдать чистый,
связанный и кликабельный сайт документации.
