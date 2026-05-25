# Zagat Boutique — Linktree

## Деплой на Vercel

1. **Залей этот проект на GitHub** (или просто drag-and-drop папку на vercel.com)

2. **Подключи Vercel KV** для трекинга кликов:
   - Зайди в свой проект на Vercel → Storage → Create → KV
   - Дай ему имя (напр. `zagat-clicks`) и нажми Create
   - Vercel автоматически добавит env переменные `KV_REST_API_URL` и `KV_REST_API_TOKEN`

3. **Готово!** Деплой произойдёт автоматически.

## Ссылки

- Главная страница: `/` — все ссылки
- Аналитика: `/analytics` — статистика кликов
- API: `/api/analytics` — JSON со всеми кликами

## Как добавить/изменить ссылки

Отредактируй `lib/links.js` и `pages/index.js` (массив `LINKS`).

## Без Vercel KV

Без подключённого KV клики считаются в memory (сбрасываются при холодном старте). Для production обязательно подключи KV.
