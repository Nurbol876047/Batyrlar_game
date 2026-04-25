# Батырды таңда: Ерлік жолы

Интерактивная образовательная мини-игра на `Next.js` для открытого урока о казахских батырах. Проект сочетает атмосферный landing, выбор героя, красивый профиль персонажа, side-scrolling mini-action уровень, исторические факты, мини-вопросы и финальный экран с рангом, очками и достижениями.

## Что внутри

- 4 героя: `Қобыланды батыр`, `Бөгенбай батыр`, `Қабанбай батыр`, `Райымбек батыр`
- cinematic landing screen с этно-атмосферой степи
- экран выбора героя с preview-панелью
- intro/profile screen выбранного батыра
- 2D gameplay на `React + requestAnimationFrame`
- on-screen controls для урока и поддержка клавиатуры
- HUD: `HP`, `energy`, `progress`, `score`, `artifacts`, `special`
- исторические вставки и мини-викторины, усиливающие героя
- финальный result screen с рангом, achievement badges и локальным best score
- store на `Zustand` c сохранением звука и рекордов в `localStorage`
- UI на `Tailwind CSS`, `Framer Motion`, shadcn-style primitives и `Lucide React`

## Стек

- `Next.js 14` App Router
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `Zustand`
- `Radix UI` primitives
- `Lucide React`

## Запуск

```bash
npm install
npm run dev
```

После запуска откройте:

```bash
http://localhost:3000
```

## Команды

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Управление в игре

Основной акцент сделан на on-screen controls:

- `Артқа`
- `Алға`
- `Секіру`
- `Атака`
- `Суперудар`

Дополнительно работают клавиши:

- `A / D` или стрелки
- `Space`
- `J`
- `K`

## Структура

```text
app/
components/
  landing/
  character-select/
  hero-profile/
  gameplay/
  layout/
  result/
  ui/
data/
hooks/
lib/
store/
```

## Ключевые файлы

- [app/page.tsx](./app/page.tsx)
- [components/batyr-journey-app.tsx](./components/batyr-journey-app.tsx)
- [components/gameplay/gameplay-scene.tsx](./components/gameplay/gameplay-scene.tsx)
- [components/gameplay/game-stage.tsx](./components/gameplay/game-stage.tsx)
- [data/batyrs.ts](./data/batyrs.ts)
- [store/game-store.ts](./store/game-store.ts)

## Особенности реализации

- Визуальный стиль построен без внешних изображений: атмосфера создаётся градиентами, орнаментами, свечением, слоистыми фонами и CSS/SVG-like декоративными блоками.
- Gameplay сделан без тяжёлого game engine, чтобы demo было стабильным и легко запускалось на уроке.
- Исторические данные хранятся отдельно в `data/batyrs.ts`, поэтому игру удобно расширять новыми героями, вопросами и фактами.
- Звуковой toggle реализован на уровне состояния; короткие SFX генерируются через `Web Audio API`, а BGM оставлен как лёгкий ambience-demo placeholder.

## Идеи для расширения

- подключить реальные аудио-файлы для фоновой музыки
- добавить режим двух уровней
- расширить систему достижений
- вынести данные в CMS или JSON для учителя
- добавить экран с итоговой таблицей класса
