---
title: Подробная настройка standard-version
group: Руководства
category: Guides
---

# Руководство по настройке **standard-version**

**Цель:** автоматизировать выпуск версий по Conventional Commits, обновлять
`package.json`, формировать `CHANGELOG.md` и создавать git-теги без ручной
рутины. Публикацию в реестр выполняете отдельной командой.

---

## Что делает `standard-version`

- определяет **SemVer** на основе истории коммитов;
- правит `version` в `package.json` (и при желании — lock-файлы);
- дополняет или создаёт `CHANGELOG.md`;
- делает релизный коммит и **тег** (`v1.2.3`).

> Инструмент **не публикует** пакет в npm.

---

## Предварительные требования

1. **Conventional Commits.** `type(scope): subject`. Примеры ниже.
2. **Чистый рабочий каталог.** Нет незакоммиченных изменений и незапушенных
   тегов.
3. **Корректный `package.json`.** Заполнены `name`, `version`, `repository`.

---

## Файлы и скрипты

```

.versionrc.cjs # конфигурация standard-version package.json # скрипты релиза
CHANGELOG.md # будет создан/обновлён

```

Рекомендуемые скрипты:

```jsonc
{
    "scripts": {
        "release": "standard-version --config .versionrc.cjs",
        "release:patch": "standard-version --release-as patch --config .versionrc.cjs",
        "release:minor": "standard-version --release-as minor --config .versionrc.cjs",
        "release:major": "standard-version --release-as major --config .versionrc.cjs",
        "release:prerelease": "standard-version --prerelease rc --config .versionrc.cjs",
        "postrelease": "git push --follow-tags origin main",
    },
}
```

> Замените `main` на вашу основную ветку, если нужно.

---

## Базовая конфигурация: `.versionrc.cjs`

```js
// .versionrc.cjs
/** @type {import('standard-version').Options} */
module.exports = {
    infile: 'CHANGELOG.md',
    header: '# Changelog\n\nВсе заметные изменения этого проекта фиксируются здесь.\n',
    tagPrefix: 'v',
    preset: 'conventionalcommits',

    packageFiles: [{ filename: 'package.json', type: 'json' }],
    bumpFiles: [
        { filename: 'package.json', type: 'json' },
        // при необходимости раскомментируйте нужный lock-файл:
        // { filename: 'package-lock.json', type: 'json' },
        // { filename: 'pnpm-lock.yaml', type: 'yaml' },
        // { filename: 'yarn.lock', type: 'text' }
    ],

    releaseCommitMessageFormat:
        'chore(release): {{currentTag}}\n\n{{#if notes}}{{notes}}{{/if}}',

    // Кастомные разделы changelog'а (опционально)
    types: [
        { type: 'feat', section: 'Новые возможности' },
        { type: 'fix', section: 'Исправления' },
        { type: 'perf', section: 'Производительность' },
        { type: 'security', section: 'Безопасность' },
        { type: 'deps', section: 'Зависимости' },

        { type: 'refactor', section: 'Рефакторинг', hidden: true },
        { type: 'docs', section: 'Документация', hidden: true },
        { type: 'test', section: 'Тесты', hidden: true },
        { type: 'build', section: 'Сборка', hidden: true },
        { type: 'ci', section: 'CI', hidden: true },
        { type: 'style', section: 'Стиль', hidden: true },
        { type: 'chore', section: 'Обслуживание', hidden: true },
        { type: 'revert', section: 'Откаты', hidden: true },
    ],

    // Явные шаблоны ссылок (необязательно, если repository задан в package.json)
    commitUrlFormat:
        'https://github.com/rotcetihra/ts-template-project/commit/{{hash}}',
    compareUrlFormat:
        'https://github.com/rotcetihra/ts-template-project/compare/{{previousTag}}...{{currentTag}}',
    issueUrlFormat:
        'https://github.com/rotcetihra/ts-template-project/issues/{{id}}',
    userUrlFormat: 'https://github.com/{{user}}',

    skip: { changelog: false, tag: false, commit: false },
};
```

---

## Conventional Commits кратко

| Пример                                | Эффект на версию                           |
| ------------------------------------- | ------------------------------------------ |
| `feat(parser): add JSON mode`         | `minor`                                    |
| `fix(cli): avoid crash on empty args` | `patch`                                    |
| `feat!: drop Node 16 support`         | `major`                                    |
| `refactor(core): split module`        | не влияет (скрыт в changelog по умолчанию) |
| Footer: `BREAKING CHANGE: rename API` | `major`                                    |

Совет: держите body/footers осмысленными, чтобы changelog не стыдно было читать.

---

## Типичный релизный цикл

1. Проверка локально:

    ```bash
    npm run typecheck && npm test && npm run src:build
    ```

2. Запуск релиза:

    ```bash
    npm run release:patch   # патч
    npm run release:minor   # минор
    npm run release:major   # мажор
    # или автоматический выбор по истории:
    npm run release
    ```

3. Просмотрите diff: `package.json`, `CHANGELOG.md`, созданный тег.
4. Публикация метаданных:

    ```bash
    npm run postrelease
    ```

5. Публикация пакета (если требуется):

    ```bash
    npm publish --access public
    ```

---

## Предрелизы (`alpha`, `beta`, `rc`)

```bash
# 1.2.3 -> 1.2.4-rc.0
npx standard-version --prerelease rc --config .versionrc.cjs
# следующий: 1.2.4-rc.1
npx standard-version --prerelease rc --config .versionrc.cjs
# задать тип + предрелиз:
npx standard-version --release-as minor --prerelease beta --config .versionrc.cjs
```

Завершение цикла: обычный `release` без `--prerelease` выпустит стабильную.

---

## Настройка разделов в `CHANGELOG`

Управляется полем `types` в `.versionrc.cjs`. Держите видимыми пользовательские
изменения (`feat`, `fix`, `perf`, `security`, `deps`), остальное помечайте
`hidden: true`, чтобы не засорять ленту.

---

## Интеграция с CI

Минимальная проверка в PR:

```bash
npm ci
npm run typecheck
npm test
npm run src:build
npm run release -- --dry-run
```

Пример GitHub Actions (фрагмент):

```yaml
# .github/workflows/release.yml
name: Release
on:
    workflow_dispatch:
jobs:
    release:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
              with: { fetch-depth: 0 }
            - uses: actions/setup-node@v4
              with: { node-version: 18, cache: 'npm' }
            - run: npm ci
            - run: npm run typecheck && npm test && npm run src:build
            - run: npm run release
            - run: git push --follow-tags origin main
```

> Для публикации в npm добавьте `NPM_TOKEN` и `npm publish` отдельным шагом.

---

## Диагностика

- **Первый релиз, нет тегов.** `npx standard-version --first-release`.
- **Неверный тип версии.** Укажите явно: `--release-as patch|minor|major`.
- **Пустой changelog.** Проверьте соответствие Conventional Commits, preset
  `conventionalcommits`, и что коммиты попали в диапазон.
- **Ссылки не подставляются.** Заполните `repository` в `package.json` или
  задайте `*UrlFormat` в `.versionrc.cjs`.
- **Нужно пропустить шаг.**
  `skip: { changelog: true | tag: true | commit: true }`.

---

## Откат релиза

Если релизный коммит уже создан, но не запушен:

```bash
git reset --hard HEAD~1        # уберёт коммит
git tag -d vX.Y.Z              # удалит тег
git checkout -- CHANGELOG.md   # при необходимости
git checkout -- package.json
```

Запушили и пожалели — придётся удалять тег и коммит в удалённой ветке и
синхронизировать changelog вручную. Подумайте дважды.

---

## Контрольный список

- [ ] Коммиты соответствуют Conventional Commits.
- [ ] `.versionrc.cjs` настроен (типы, ссылки, bump-файлы).
- [ ] Скрипты `release:*` и `postrelease` корректны для вашей ветки.
- [ ] В `package.json` корректны `name`, `version`, `repository`.
- [ ] В CI есть dry-run на PR и ручной запуск релиза.
