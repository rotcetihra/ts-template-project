---
title: Подробная настройка Commitlint
group: Руководства
category: Guides
---

# Руководство по настройке **Commitlint**

**Назначение:** пошаговая инструкция для настройки проверки сообщений коммитов в
стиле **Conventional Commits** в проекте `ts-template-project`. Все зависимости
в шаблоне уже установлены; остаётся уточнить конфигурацию, список типов/областей
и подключить git-хук `commit-msg`.

---

## 1. Что вы получите

- Единый стиль коммитов, совместимый с автогенерацией **CHANGELOG** и релизов.
- Проверку структуры `type(scope): subject` плюс правила для `body`/`footer`.
- Гибкую настройку: допустимые типы, формат `scope`, длины строк, регистр темы.
- Интеграцию с **Husky** и процессом релизов (**standard-version**).

---

## 2. Файлы и структура

```
commitlint.config.cjs     # конфигурация Commitlint (CommonJS)
.husky/commit-msg         # git-хук для проверки сообщений
package.json              # скрипты релизов (есть в шаблоне)
```

> В шаблоне уже подключены `@commitlint/cli` и
> `@commitlint/config-conventional`.

---

## 3. Быстрый старт

1. Добавьте/проверьте конфиг:

```js
// commitlint.config.cjs
/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // HEADER
        'header-max-length': [2, 'always', 100],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test',
                'release',
                'security',
                'deps',
            ],
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        // Если нужна свобода регистра темы (русский/имена собственные), выключите правило:
        // 'subject-case': [0],

        // SCOPE
        'scope-empty': [0],
        'scope-case': [2, 'always', 'kebab-case'],

        // BODY/FOOTER
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [2, 'always'],
        // Примеры опций:
        // 'body-max-line-length': [2, 'always', 120],
        // 'references-empty': [2, 'never'],
    },

    // Игнор некоторых сообщений (пример)
    // ignores: [(msg) => msg.startsWith('DRAFT')],
};
```

2. Подключите хук:

```sh
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no-install commitlint --edit "$1"
```

3. Дайте права на исполнение:

```sh
chmod +x .husky/commit-msg
```

Готово: любые коммиты будут проверяться перед записью.

---

## 4. Формат Conventional Commits

### 4.1 Заголовок

```
<type>(<scope>)?: <subject>
```

Примеры:

```
feat(core): добавить фабрику клиентов http
fix(utils): корректный парсинг json-ошибок
docs: обновить раздел "Быстрый старт"
```

Рекомендации:

- `type` отражает природу изменения (см. `type-enum`).
- `scope` обозначает подсистему/пакет/слой: `core`, `builders`, `utils`,
  `types`, `docs`.
- `subject` в императиве, без точки, кратко.

### 4.2 Body

- Мотивация, детали, риски, способ тестирования.
- Каждая мысль отдельным абзацем.
- Перед `body` обязательна пустая строка.

### 4.3 Footer

- Ссылки на задачи, пометки `BREAKING CHANGE:` и др.

```
BREAKING CHANGE: options.timeout → requestTimeout
Closes #123
Ref #456
```

### 4.4 Семантические версии

- `feat:` → **minor**
- `fix:` → **patch**
- `BREAKING CHANGE:` → **major**

Совместимо со `standard-version`.

---

## 5. Рекомендации по областям (`scope`)

Согласуйте заранее перечень областей, отражающих архитектуру проекта. Примеры:

```
core, builders, utils, types, docs, ci, build, release, tests
```

Стиль: `kebab-case`. Если область не нужна, опустите её.

---

## 6. Опционально: интерактивные коммиты

Хотите выбор из списка типов/областей в терминале:

```bash
npm i -D @commitlint/prompt-cli
npx commit
```

Бонус: можно задать подсказки по `scopes` в конфиге через секцию `prompt`.

---

## 7. Интеграция с релизами (`standard-version`)

Шаблон содержит скрипты:

```
release, release:patch, release:minor, release:major
```

Чем строже соблюдаете формат коммитов, тем предсказуемее `CHANGELOG` и теги.

---

## 8. CI/PR-проверки

Проверка последнего коммита:

```bash
npx commitlint --from HEAD~1 --to HEAD
```

Проверка всей ветки относительно `origin/main`:

```bash
npx commitlint --from origin/main --to HEAD
```

Добавьте шаг в конвейер, чтобы сборка падала на некорректных сообщениях до
слияния.

---

## 9. Диагностика

- **«Выглядит корректно, но блокирует»** Проверьте пробел после двоеточия,
  отсутствие точки в конце заголовка, регистр темы и ограничения длины.

- **Русские заголовки с прописной буквы** Отключите `subject-case`:

    ```js
    'subject-case': [0]
    ```

- **Нужен тип, которого нет** Добавьте его в `type-enum`. Список держите
  коротким и понятным.

- **Сообщения слияния/ботов мешают** Добавьте в `ignores` функцию,
  отфильтровывающую такие сообщения.

---

## 10. Контрольный список

- [ ] Актуален `commitlint.config.cjs`: типы, `scope`, правила.
- [ ] Подключён `.husky/commit-msg` и имеет права на исполнение.
- [ ] Договорены области (`scope`) и их стиль.
- [ ] Включены правила про пустые строки перед `body`/`footer`.
- [ ] Пайплайн релизов (`standard-version`) использует корректные коммиты.

---

## 11. Примеры валидных сообщений

```
feat(core): добавить фабрику клиентов http

описание решения, мотивация и ограничения
refactor: выделение общего конфига будет выполнено отдельным pull request

Closes #231
```

```
fix(utils): корректная обработка таймаута при повторе

почему возникала ошибка и как воспроизвести
добавлены модульные тесты для краевого случая

Ref #412
```

```
perf(builders): уменьшить аллокации в parseConfig

BREAKING CHANGE: options.timeout переименован в requestTimeout
```
