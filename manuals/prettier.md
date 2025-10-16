---
title: Подробная настройка Prettier
group: Руководства
category: Guides
---

# Руководство по настройке **Prettier**

**Назначение:** пошаговая инструкция для проектов на базе `ts-template-project`.
Все зависимости уже установлены; остаётся подстроить конфигурацию, исключения и
интеграции под свой репозиторий.

---

## 1. Что вы получите

- Единый стиль форматирования кода и текстов.
- Предсказуемое форматирование в редакторе, при коммите и в CI.
- Минимум конфликтов с ESLint за счёт согласованных настроек.

---

## 2. Какие файлы менять

В шаблоне уже есть точки конфигурации:

```
prettier.config.js   # основные правила (ESM)
.prettierignore      # файлы/пути, которые не форматируются
.husky/pre-commit    # (опционально) pre-commit хук
.lintstagedrc.mjs    # (опционально) какие файлы форматировать при коммите
```

> В `package.json` уже есть скрипты `format` и `format:check`.

---

## 3. Быстрый старт

1. Откройте `prettier.config.js`, скорректируйте базовые опции (см. ниже).
2. Добавьте свои пути в `.prettierignore`.
3. При необходимости настройте `.lintstagedrc.mjs`.
4. Включите форматирование при сохранении в редакторе (см. раздел 7).
5. Первичное выравнивание:

```bash
npm run format
```

Зафиксируйте изменения отдельным коммитом.

---

## 4. Часто меняемые опции

### 4.1 Базовое форматирование

| Опция           | Назначение                   | Типичные значения   |
| --------------- | ---------------------------- | ------------------- |
| `printWidth`    | Целевая длина строки         | 80 / 100 / 120      |
| `tabWidth`      | Ширина отступа               | 2 или 4             |
| `useTabs`       | Табуляция вместо пробелов    | `false`             |
| `semi`          | Точка с запятой              | `true`              |
| `singleQuote`   | Одинарные кавычки в JS/TS    | `true` или `false`  |
| `trailingComma` | Хвостовые запятые            | `'es5'` или `'all'` |
| `endOfLine`     | Нормализация переводов строк | `'lf'`              |

Рекомендации для библиотек: `printWidth: 100`, `trailingComma: 'all'`,
`singleQuote` на усмотрение команды.

### 4.2 Обрамление и парсер

| Опция                        | Назначение                                     | Рекомендация  |
| ---------------------------- | ---------------------------------------------- | ------------- |
| `bracketSpacing`             | Пробелы в `{ a: 1 }`                           | `true`        |
| `quoteProps`                 | Кавычки у ключей объектов                      | `'as-needed'` |
| `requirePragma`              | Форматировать только с `@format`               | `false`       |
| `insertPragma`               | Вставлять `@format` автоматически              | `false`       |
| `embeddedLanguageFormatting` | Форматировать встроенные блоки (JS в MD и др.) | `'auto'`      |

### 4.3 JS/TS и разметка

| Опция                       | Назначение                                          | Рекомендация |
| --------------------------- | --------------------------------------------------- | ------------ |
| `arrowParens`               | Скобки у единственного параметра стрелочных функций | `'always'`   |
| `bracketSameLine`           | Где ставить `>` у многострочных JSX/HTML            | `false`      |
| `jsxSingleQuote`            | Одинарные кавычки в JSX                             | `false`      |
| `singleAttributePerLine`    | По одному атрибуту на строке                        | `false`      |
| `htmlWhitespaceSensitivity` | Чувствительность к пробелам в HTML                  | `'css'`      |
| `vueIndentScriptAndStyle`   | Отступы внутри `<script>/<style>` в `.vue`          | `false`      |

### 4.4 Markdown/MDX

| Опция       | Назначение               | Рекомендация                |
| ----------- | ------------------------ | --------------------------- |
| `proseWrap` | Перенос строк в Markdown | `'preserve'` или `'always'` |

- Для стабильных различий в коммитах: `preserve`.
- Для жёсткой ширины текста: `always` + `printWidth` (например, 100).

---

## 5. Рекомендуемый `prettier.config.js`

```js
// prettier.config.js
export default {
    // 1) БАЗОВОЕ ФОРМАТИРОВАНИЕ
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: 'all',
    bracketSpacing: true,
    endOfLine: 'lf',
    quoteProps: 'as-needed',

    // 2) ПАРСЕР И ОБЛАСТЬ
    requirePragma: false,
    insertPragma: false,
    embeddedLanguageFormatting: 'auto',

    // 3) JS/TS
    arrowParens: 'always',

    // 4) JSX/HTML/Vue
    bracketSameLine: false,
    jsxSingleQuote: false,
    singleAttributePerLine: false,
    htmlWhitespaceSensitivity: 'css',
    vueIndentScriptAndStyle: false,

    // 5) MARKDOWN
    proseWrap: 'preserve',

    // 6) ПРИМЕР ПЕРЕОПРЕДЕЛЕНИЙ
    // overrides: [
    //   { files: ['**/*.md','**/*.mdx'], options: { proseWrap: 'always' } },
    //   { files: ['**/*.{yml,yaml}'],     options: { singleQuote: false } }
    // ]
};
```

---

## 6. `.prettierignore`

Расширьте список под ваш проект:

```
node_modules/
dist/
build/
coverage/
docs/
.eslintcache
*.min.js
*.map

# Бинарные/медиа
**/*.{png,jpg,jpeg,gif,webp,svg,ico,pdf}
```

> Prettier **не использует** `.gitignore` автоматически. Дублируйте ключевые
> исключения.

---

## 7. Интеграция с редактором (VS Code)

Локальный Prettier и автоформат при сохранении:

```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "prettier.prettierPath": "./node_modules/prettier",
    "prettier.configPath": "./prettier.config.js"
}
```

При нескольких форматировщиках используйте профили вида `[language]`.

---

## 8. Интеграция с ESLint и `lint-staged`

### 8.1 ESLint

В шаблоне подключён `eslint-config-prettier` через Flat Config. Если используете
не flat-конфиг, проверьте наличие `"extends": ["prettier"]` в конфигурации.

### 8.2 lint-staged (pre-commit)

Пример `.lintstagedrc.mjs`:

```js
export default {
    ignore: ['dist/**', 'build/**', 'coverage/**', 'docs/**'],
    '**/*.{js,jsx,ts,tsx,json,md,yml,yaml}': ['prettier -w --log-level warn'],
};
```

---

## 9. Командная работа и CI

1. **Единый EOL для всех:**

```
# .gitattributes
* text=auto eol=lf
```

2. **Проверка в CI** без записи:

```bash
npm run format:check
```

3. **Первичное выравнивание** часто даёт большой объём различий. Сохраните
   отдельным коммитом, например: `chore: format with Prettier`.

---

## 10. Подсказки

- Хотите меньше переносов — поднимите `printWidth` до 100/120.
- Минимизируйте различия в списках — `trailingComma: 'all'`.
- Документационные репозитории — чаще `proseWrap: 'always'` и `printWidth: 100`.
- Monorepo — один корневой конфиг + `overrides` на пакеты при необходимости.

---

## 11. Скрипты в `package.json`

Шаблон уже содержит:

```jsonc
{
    "scripts": {
        "format": "prettier -w .",
        "format:check": "prettier -c .",
    },
}
```

Запуск:

```bash
npm run format        # форматирование проекта
npm run format:check  # только проверка
```

---

## 12. Чек-лист

- [ ] Обновлен `prettier.config.js`.
- [ ] Заполнен `.prettierignore`.
- [ ] В редакторе включено форматирование при сохранении.
- [ ] ESLint согласован с Prettier.
- [ ] Настроен `lint-staged` (если используете Husky).
- [ ] В CI добавлена проверка `format:check`.
- [ ] Выполнено первичное форматирование.
