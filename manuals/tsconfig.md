---
title: Подробная настройка TypeScript
group: Руководства
category: Guides
---

# Настройка TypeScript-конфигураций (tsconfig)

**Цель:** быстро адаптировать преднастроенную среду `ts-template-project` под
вашу библиотеку. Ниже описаны три уровня конфигураций: базовая
(`tsconfig.base.json`), сборочная (`tsconfig.build.json`) и для разработки/IDE
(`tsconfig.json`). Все примеры приведены в формате JSONC с комментариями.

---

## 1. Зачем три файла и как они связаны

- **База (`tsconfig.base.json`)**: целевой стандарт JavaScript, модель модулей,
  строгий режим, пути импортов. Наследуется остальными конфигурациями.
- **Сборка (`tsconfig.build.json`)**: отвечает за генерацию артефактов в `dist/`
  (JS, `.d.ts`, карты источников).
- **Разработка (`tsconfig.json`)**: комфорт в IDE и быстрые проверки типов без
  генерации файлов.

Рекомендуемая структура:

```
.
├─ src/                   # исходники библиотеки
├─ tests/                 # модульные тесты
├─ dist/                  # артефакты сборки
├─ tsconfig.base.json     # базовые правила и платформа
├─ tsconfig.build.json    # сборка (d.ts, sourcemap и т. д.)
└─ tsconfig.json          # разработка/IDE (noEmit)
```

---

## 2. Базовая конфигурация: `tsconfig.base.json`

Назначение: единая точка правды для целевого стандарта JavaScript, модулей,
строгих проверок и алиасов.

```jsonc
// tsconfig.base.json
{
    "compilerOptions": {
        // ------------------------ ЯЗЫК И СРЕДА -------------------------------
        "target": "ES2022",
        "lib": ["ES2022"], // для браузера добавьте "DOM"
        "types": ["node", "jest"],

        // --------------------------- МОДУЛИ -----------------------------------
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "moduleDetection": "force",

        // ------------------------ СТРОГИЕ ПРОВЕРКИ ----------------------------
        "strict": true,
        "exactOptionalPropertyTypes": true,
        "noUncheckedIndexedAccess": true,
        "useUnknownInCatchVariables": true,
        "noImplicitOverride": true,
        "noPropertyAccessFromIndexSignature": true,

        // --------------------- КОМПИЛЯЦИЯ И ВЫВОД -----------------------------
        "isolatedModules": true, // важно для многих инструментов (ts-jest и т. п.)
        "skipLibCheck": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "verbatimModuleSyntax": true,
        "useDefineForClassFields": true,
        "forceConsistentCasingInFileNames": true,

        // --------------------- ПУТИ И АЛИАСЫ ----------------------------------
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "tests/*": ["tests/*"],
        },
    },
}
```

**Подсказки:**

- Браузерная библиотека: `lib: ["ES2022", "DOM"]`.
- Не используете Jest — уберите `"jest"` из `types`.
- Нужна совместимость ниже Node 18 — снизьте целевой стандарт JavaScript и `lib`
  (например, ES2020).

---

## 3. Сборочная конфигурация: `tsconfig.build.json`

Назначение: генерация JS плюс деклараций типов и их карт для корректной
навигации в IDE/TypeDoc.

```jsonc
// tsconfig.build.json
{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        // --------------------- КОМПИЛЯЦИЯ И ВЫВОД -----------------------------
        "outDir": "dist",
        "rootDir": "src",

        // Типы и карты типов — обязательно для библиотек
        "declaration": true,
        "declarationMap": true,

        // Карты JS для отладки
        "sourceMap": true,

        // В публичные .d.ts не попадает @internal
        "stripInternal": true,

        "noEmit": false, // разрешаем генерацию файлов
        "composite": true, // для Project References и кэша
        "incremental": true,
        "tsBuildInfoFile": ".tsbuildinfo",
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules", "tests"],
}
```

**Подсказки:**

- `declarationMap: true` даёт точные ссылки из документации/IDE к исходникам.
- В монорепозитории можно хранить `tsBuildInfoFile` в общем каталоге кэша.

---

## 4. Конфигурация для разработки/IDE: `tsconfig.json`

Назначение: проверки типов и отладка без генерации файлов.

```jsonc
// tsconfig.json
{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "noEmit": true,
        "sourceMap": true,
        "allowImportingTsExtensions": true, // удобно при NodeNext и ESM
    },
    "include": ["src", "tests"],
    "exclude": ["dist", "node_modules"],
}
```

**Подсказки:**

- Папка с тестами другая? Обновите `include`.
- Если используете инструменты, исполняющие TS напрямую, проверьте их
  совместимость с `module: "NodeNext"`.

---

## 5. Согласование с `package.json`

Для ESM-библиотек:

```jsonc
{
    "type": "module",
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.js",
        },
    },
}
```

**Проверьте**, что сборка кладёт файлы туда, куда смотрят
`main`/`types`/`exports`.

> Нужен гибрид ESM/CJS? Потребуется отдельная сборка CJS и условные экспорты
> `"require"`. Это вне рамок базовой настройки.

---

## 6. Алиасы путей: от TS до среды выполнения

В TS настроены алиасы `@/*` и `tests/*`. Для сборщиков и сред запуска они:

- либо поддерживаются нативно/плагинами,
- либо не участвуют в рантайме, если сборка перед публикацией выдаёт
  относительные пути.

Если конкретная среда запуска не понимает алиасы, добавьте подходящий
резолвер/плагин для вашей системы сборки или тестов.

---

## 7. Интеграция с TypeDoc

Чтобы из документации клик вёл на строки исходников:

- TypeDoc должен использовать `tsconfig.build.json`;
- в сборочной конфигурации должны быть `declaration: true` и
  `declarationMap: true`;
- удобно указать в `typedoc.config.js`: `displayBasePath: "src"`.

---

## 8. Частые сценарии и настройки

### Браузерная библиотека

```jsonc
"lib": ["ES2022", "DOM"]
```

Если у вас JSX/TSX:

```jsonc
"jsx": "react-jsx"
```

### Старые окружения

Снижайте целевой стандарт JavaScript и `lib`, дополнительно обеспечивайте
полифилы.

### Ускорение сборки

`skipLibCheck: true` уже включён. Для диагностики сторонних типов можно временно
отключать это ускорение.

### Монорепозиторий

Включайте `composite: true` и используйте `references` в корне для ускорения
больших проектов.

---

## 9. Диагностика и ошибки: быстрое устранение

- **ts-jest предупреждает про `isolatedModules`** Установите
  `isolatedModules: true` в `tsconfig.json`/`tsconfig.base.json` (а не в
  настройках `ts-jest`), чтобы избежать устаревших опций.

- **ESM/NodeNext и импорты с `.js` в исходниках** Для тестов добавьте
  сопоставление в среде запуска тестов (например, в Jest `moduleNameMapper`),
  чтобы спецификатор `*.js` указывал на соответствующий `*.ts`. В рабочей сборке
  после компиляции всё будет в `dist/*.js`.

- **Не совпали пути в `exports` и фактическая сборка** Проверьте `outDir`,
  `rootDir`, а также `main`, `types` и дерево `exports` в `package.json`.

---

## 10. Короткий чек-лист

1. База (`tsconfig.base.json`): целевой стандарт JavaScript, NodeNext, strict,
   алиасы `@/*`.
2. Сборка (`tsconfig.build.json`): `outDir`, `rootDir`,
   `declaration + declarationMap`, `sourceMap`, `composite`.
3. IDE (`tsconfig.json`): `noEmit`, `sourceMap`, `allowImportingTsExtensions`.
4. `package.json`: синхронизированы `main`/`types`/`exports` с содержимым
   `dist/`.
5. TypeDoc: использует `tsconfig.build.json` и получает `declarationMap`.

---

## 11. Полные примеры файлов

**`tsconfig.base.json`**

```jsonc
{
    "compilerOptions": {
        "target": "ES2022",
        "lib": ["ES2022"],
        "types": ["node", "jest"],

        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "moduleDetection": "force",

        "strict": true,
        "exactOptionalPropertyTypes": true,
        "noUncheckedIndexedAccess": true,
        "useUnknownInCatchVariables": true,
        "noImplicitOverride": true,
        "noPropertyAccessFromIndexSignature": true,

        "isolatedModules": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "verbatimModuleSyntax": true,
        "useDefineForClassFields": true,
        "forceConsistentCasingInFileNames": true,

        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "tests/*": ["tests/*"],
        },
    },
}
```

**`tsconfig.build.json`**

```jsonc
{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "outDir": "dist",
        "rootDir": "src",

        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "stripInternal": true,

        "noEmit": false,
        "composite": true,
        "incremental": true,
        "tsBuildInfoFile": ".tsbuildinfo",
    },
    "include": ["src"],
    "exclude": ["dist", "node_modules", "tests"],
}
```

**`tsconfig.json`**

```jsonc
{
    "extends": "./tsconfig.base.json",
    "compilerOptions": {
        "noEmit": true,
        "sourceMap": true,
        "allowImportingTsExtensions": true,
    },
    "include": ["src", "tests"],
    "exclude": ["dist", "node_modules"],
}
```

---

## 12. Скрипты в `package.json`

```jsonc
{
    "scripts": {
        "typecheck": "tsc -p tsconfig.json --noEmit",
        "build": "tsc -p tsconfig.build.json",
        "clean": "rimraf dist .tsbuildinfo",
    },
}
```
