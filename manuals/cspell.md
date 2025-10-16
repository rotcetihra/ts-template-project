---
title: Подробная настройка CSpell
group: Руководства
category: Guides
---

---

# Руководство по настройке **CSpell**

**Назначение:** пошаговая настройка проверки орфографии в коде и документации
для шаблона `ts-template-project`. На выходе — низкий уровень шума, поддержка
нескольких языков, понятные исключения и интеграция с pre-commit/CI.

---

## 1. Что вы получите

- Проверку орфографии в `*.ts`, `*.md`, `*.json(yml)` и др.
- Многоязычную поддержку (`en`, `ru`) и внешние словари.
- Минимум ложных срабатываний за счёт корректных исключений и регулярных
  выражений.
- Интеграцию в `lint-staged` и CI.

---

## 2. Файлы и структура

```
.
├─ cspell.json               # основная конфигурация (JSON/JSONC)
├─ .cspell/
│  └─ words.txt              # проектный словарь (один термин в строку)
├─ .cspellignore             # (опционально) список исключений в стиле .gitignore
├─ .lintstagedrc.mjs         # (опционально) pre-commit конфигурация
└─ package.json              # скрипты, если нужны
```

> Реально достаточно `cspell.json` и `.cspell/words.txt`. Исключения можно
> хранить либо в `cspell.json` (`ignorePaths`), либо в отдельном
> `.cspellignore`.

---

## 3. Быстрый старт

1. Установите набор языков в `cspell.json` (например, `"language": "en,ru"`).
2. Импортируйте внешние словари (русский и, при желании, US/GB):
   `@cspell/dict-ru_ru`, `@cspell/dict-en_us`.
3. Дополните `ignorePaths` под ваши артефакты.
4. Создайте `.cspell/words.txt` и перенесите туда постоянные термины.
5. Запустите локально:

```bash
npx cspell lint --no-must-find-files --gitignore --unique --color --no-progress .
```

---

## 4. Рекомендуемая конфигурация `cspell.json`

Ниже — практичный базовый конфиг с именованными паттернами, локальным словарём и
минимумом шума. Формат — JSONC (допускает комментарии).

````jsonc
{
    // ====================================================================
    // 1) БАЗА
    // ====================================================================
    "version": "0.2",

    // Перечень языков через запятую
    "language": "en,ru",

    // Подключение внешних словарей (пакеты должны быть в devDependencies)
    "import": [
        "@cspell/dict-ru_ru/cspell-ext.json",
        "@cspell/dict-en_us/cspell-ext.json",
    ],

    // Учитывать .gitignore
    "useGitignore": true,

    // ====================================================================
    // 2) ОБЛАСТЬ ПРОВЕРКИ
    // ====================================================================

    // Исключения по путям (glob-шаблоны)
    "ignorePaths": [
        "node_modules",
        "dist",
        "build",
        "coverage",
        "docs",
        "site",
        ".husky",
        ".github",
        ".turbo",
        ".next",
        ".cache",
        "**/*.d.ts",
        "**/*.map",
        "**/*.min.js",
    ],

    // Именованные паттерны (можно переиспользовать в ignoreRegExpList)
    "patterns": [
        { "name": "urls", "pattern": "https?://\\S+" },
        { "name": "uuidsOrHashes", "pattern": "\\b[0-9a-fA-F]{7,}\\b" },
        {
            // Семантические версии: 1.2.3, 1.2.3-beta.1 и т.п.
            "name": "semver",
            "pattern": "\\b\\d+\\.\\d+\\.\\d+(?:-[\\w.-]+)?\\b",
        },
        { "name": "fencedCode", "pattern": "```[\\s\\S]*?```" },
    ],

    // Регулярки, содержимое которых не нужно проверять
    "ignoreRegExpList": ["#urls", "#uuidsOrHashes", "#semver", "#fencedCode"],

    // ====================================================================
    // 3) СЛОВАРИ И ЯЗЫКОВЫЕ НАСТРОЙКИ
    // ====================================================================

    // Локальный словарь проекта (по одному слову в строку)
    "dictionaryDefinitions": [
        {
            "name": "project-words",
            "path": ".cspell/words.txt",
            "addWords": true,
        },
    ],
    "dictionaries": ["project-words"],

    // Тонкая подстройка под типы файлов
    "languageSettings": [
        {
            "languageId": ["markdown", "mdx"],
            "allowCompoundWords": true,
        },
        {
            "languageId": ["json", "jsonc", "yaml", "yml"],
            "caseSensitive": false,
        },
        {
            // TypeScript/JS: разрешим идентификаторы с дефисами/нижним подчёркиванием,
            // и не обращаем внимание на хеш-значения
            "languageId": ["typescript", "javascript"],
            "ignoreRegExpList": ["#uuidsOrHashes"],
        },
    ],

    // ====================================================================
    // 4) СЛОВА И ЗАПРЕЩЁННЫЕ ФОРМЫ
    // ====================================================================

    // Постоянные проектные слова (имена, термины), если не хотите words.txt
    "words": [
        "Arhitector",
        "rotcetihra",
        "NodeNext",
        "TypeDoc",
        "tsconfig",
        "tsbuildinfo",
        "jest",
        "ts-jest",
        "typedoc",
        "Prettier",
        "ESLint",
        "semver",
    ],

    // Пример списка слов, которые следует считать ошибочными.
    // Здесь показаны корректные варианты, чтобы сам пример не срабатывал в проверке.
    "flagWords": ["the", "receive", "address"],

    // ====================================================================
    // 5) ЛОКАЛЬНЫЕ ПРАВКИ ДЛЯ ОТДЕЛЬНЫХ ПУТЕЙ (overrides)
    // ====================================================================

    "overrides": [
        {
            "filename": "**/*.md",
            "ignoreRegExpList": ["#semver", "#urls", "#fencedCode"],
        },
    ],
}
````

---

## 5. Пользовательский словарь `.cspell/words.txt`

Создайте файл и добавляйте по одному слову на строку:

```
рантайм
резолвер
сопоставляется
глобальные переменные
CLI
Node.js
```

Так проще проводить ревью и поддерживать термины, чем держать большой массив
`words` в JSON.

---

## 6. Снижение шума: приёмы

- Поддерживайте `ignorePaths` в актуальном состоянии (dist, coverage, кэши).
- Используйте именованные паттерны (`patterns`) и подключайте их через
  `ignoreRegExpList`. Это переиспользуемо и наглядно.
- Для Markdown включайте `allowCompoundWords`, иначе составные термины будут
  ложно подсвечиваться.
- Для «шумных» участков (генерируемые файлы, большие блоки кода в MD) добавляйте
  `overrides` с дополнительными исключениями.

---

## 7. Интеграция с `lint-staged` (pre-commit)

Проверяйте только изменённые текстовые файлы и конфигурации:

```js
// .lintstagedrc.mjs
export default {
    '**/*.{md,mdx,txt}': [
        'cspell lint --no-must-find-files --gitignore --unique --color --quiet --no-progress',
    ],
    '**/*.{json,jsonc,yml,yaml}': [
        'cspell lint --no-must-find-files --gitignore --unique --color --quiet --no-progress',
    ],
};
```

Если нужно дополнительно проверять исходники:

```js
'**/*.{ts,tsx,js,mjs,cjs}': [
  'cspell lint --no-must-find-files --gitignore --unique --color --quiet --no-progress'
]
```

---

## 8. Интеграция с редактором (VS Code)

Установите расширение **Code Spell Checker** и добавьте в настройки рабочего
пространства:

```json
{
    "cSpell.configFile": "./cspell.json",
    "cSpell.language": "en,ru",
    "cSpell.useGitignore": true,
    "cSpell.enabledLanguageIds": [
        "markdown",
        "mdx",
        "json",
        "jsonc",
        "yaml",
        "yml",
        "javascript",
        "typescript"
    ]
}
```

---

## 9. Интеграция с CI

Минимальная команда:

```bash
npx cspell lint --no-must-find-files --gitignore --unique --color --no-progress .
```

- `--no-must-find-files` — не падать, если по маскам ничего не нашлось.
- `--gitignore` — учитывать `.gitignore`.
- `--unique` — без повторов одного и того же слова в выводе.
- `--no-progress` — компактный лог.

---

## 10. Рабочий процесс добавления слов

1. Запустите CSpell локально/в PR.
2. Корректные термины переносите в `.cspell/words.txt` или `words`.
3. Частые опечатки — в `flagWords`.
4. Технический шум (URL, хеши, версии) — в `patterns` и `ignoreRegExpList`.

---

## 11. Монорепозиторий

- Держите корневой `cspell.json` и проектные словари через
  `dictionaryDefinitions`.
- Для пакетов с разными доменными терминами подключайте отдельные `words.txt`
  через `overrides` или отдельные `dictionaries`.

---

## 12. Контрольный список

- [ ] Указаны нужные языки и импортированы внешние словари.
- [ ] Настроены `ignorePaths`, именованные `patterns` и `ignoreRegExpList`.
- [ ] Проектные термины вынесены в `.cspell/words.txt`.
- [ ] Настроен pre-commit (`lint-staged`) и/или шаг CI.
- [ ] Проверка стабильно проходит локально и в PR.
