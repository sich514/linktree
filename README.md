# Linktree — Next.js для Vercel

## Почему переписан на Next.js

Flask + запись в файл (`clicks.json`) не работает на Vercel:
- Файловая система **read-only** на Vercel (serverless)
- Данные сбрасываются при каждом холодном старте

**Решение:** Next.js API Routes + Vercel KV (Redis) для хранения кликов.

---

## Деплой на Vercel

### 1. Залить код на GitHub
```bash
git add .
git commit -m "migrate to Next.js"
git push
```

### 2. Подключить проект в Vercel
- Зайди на [vercel.com](https://vercel.com)
- Import Git Repository → выбери репозиторий
- Framework Preset: **Next.js** (определится автоматически)
- Deploy

### 3. Подключить Vercel KV (для сохранения кликов)
> Без этого шага клики считаются только в памяти и сбрасываются при рестарте

1. В дашборде Vercel → твой проект → вкладка **Storage**
2. **Create** → выбери **KV** (Redis)
3. Назови, например `linktree-kv`
4. **Connect to Project** → выбери свой проект
5. Vercel автоматически добавит переменные окружения:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
6. Передеплой проект (Deployments → Redeploy)

**Готово!** Теперь клики сохраняются перманентно.

---

## Локальная разработка

```bash
npm install
npm run dev
```

Без KV используется in-memory хранилище (данные сбрасываются при рестарте сервера — для продакшена нужен KV).

---

## Структура проекта

```
├── pages/
│   ├── index.js          # Главная страница (Linktree)
│   ├── analytics.js      # Страница аналитики
│   └── api/
│       ├── go/[name].js  # Редирект + счётчик кликов
│       └── analytics.js  # API для получения статистики
├── lib/
│   ├── kv.js             # Хранилище (Vercel KV или in-memory)
│   └── links.js          # Конфиг ссылок
├── vercel.json
└── package.json
```

## Добавить новую ссылку

Открой `lib/links.js` и добавь:
```js
export const LINKS = {
  // ...существующие
  telegram: "https://t.me/твой_канал",
};
```

Потом в `pages/index.js` в массив `LINKS_CONFIG` добавь:
```js
{ key: 'telegram', icon: '✈️', label: 'Telegram' },
```

## Аналитика

Доступна по адресу: `твой-домен.vercel.app/analytics`
