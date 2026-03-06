# Mise AI

**An AI cooking assistant powered by Gemini.** Chat naturally about food, get recipe cards with structured ingredient lists, and manage your shopping list — all in one mobile app.

## What is Mise?

Mise is a mobile-first cooking companion where you chat with an AI that understands food. Ask it anything — "what can I make with chicken thighs and miso?" — and it responds with rich, typed widget blocks: recipe cards, ingredient lists, step-by-step instructions, and a shopping list you can check off at the store.

The AI uses a structured tool harness to create, search, and update recipes in your personal collection. The chat *is* the interface — every action flows through conversation.

### Key features

- **AI chat** with Gemini — recipe discovery, meal planning, cooking Q&A
- **Typed widget blocks** — recipe cards, ingredient lists, and shopping lists rendered as native components
- **Shopping list** — built from recipes, works offline
- **Recipe collection** — save, search, and revisit your recipes
- **Firebase auth** — sign in with email, Google, or Apple

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native (Expo SDK 55), NativeWind (Tailwind CSS v3) |
| AI | Google Gemini with structured tool calls |
| Auth & backend | Firebase |

## Getting started

```bash
npm install
npm start          # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web bundle
```

Type-check:
```bash
npx tsc --noEmit
```

## Project structure

```
app/             # Expo Router screens and layouts
components/      # Shared React Native components
types/           # TypeScript types
constants/       # Colors, config values
specs/           # Product specs
docs/            # Architecture docs & brainstorms
```

## Widget model

The Gemini backend returns structured blocks:

```json
{ "blocks": [{ "type": "recipe_card", "data": { ... } }] }
```

Each block type maps 1:1 to a React Native component. Widget button taps (e.g. "Add to shopping list") inject a plain-text chat message — no direct state mutations.

## Issue tracking

Uses **bd** (beads). Run `bd ready` to find available work. See `AGENTS.md` for agent instructions.

---

*Built by [li0nel](https://github.com/li0nel)*
