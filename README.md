# @rotcetihra/ts-template-project

Шаблонный проект на **TypeScript** с преднастроенной системой сборки,
тестирования и генерации документации.

## Возможности

-   Поддержка **ECMAScript Modules** (`.mts`).
-   Конфигурация **TypeScript** разделена на базовую, сборочную и
    IDE-ориентированную.
-   Тестирование с использованием **Jest** и `ts-jest` в режиме **ESM**.
-   Генерация документации с помощью TypeDoc и подключённых плагинов.
-   Настроенные скрипты npm для сборки, очистки, тестирования и документации.

## Установка

```bash
git clone https://github.com/rotcetihra/ts-template-project.git
cd ts-template-project
npm install
```

## Скрипты

-   `npm run build` — выполняет сборку исходного кода и генерацию документации.
-   `npm run clean` — удаляет артефакты сборки и документации.
-   `npm test` — запускает тесты с **Jest**.
-   `npm run docs:build` — генерирует документацию **TypeDoc**.
-   `npm run docs:serve` — поднимает локальный сервер для просмотра
    документации.

## Тестирование

Тесты находятся в каталоге `tests/` и пишутся на **TypeScript** (`.mts`).

Для запуска:

```bash
npm test
```

## Документация

Документация генерируется в каталог `docs/`:

```bash
npm run docs:build
npm run docs:serve
```

## Структура проекта

```
src/                 исходный код
tests/               модульные тесты
dist/                результат сборки
tsconfig.base.json   базовые настройки TypeScript
tsconfig.build.json  настройки TypeScript для сборки
tsconfig.json        настройки TypeScript для IDE
jest.config.mjs      конфигурация Jest
typedoc.json         конфигурация TypeDoc
package.json
README.md
```

## Публикация

В `package.json` настроено:

-   `"type": "module"` — проект использует **ESM**.
-   `"exports"` — указаны точки входа для `import` и типов.
-   `"sideEffects": false` — поддержка tree-shaking.
-   `"publishConfig": { "access": "public" }` — публикация в `npm` как
    публичного пакета.

## Лицензия

Проект распространяется под лицензией [MIT](./LICENSE).

Неофициальный перевод лицензии на русский язык (для справки):
[MIT RUS](./LICENSE.ru.md).
