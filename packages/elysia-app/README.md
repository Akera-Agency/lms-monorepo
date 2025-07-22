# Elysia Todo Example

This is a minimal example of an Elysia.js app following the principles from [Integrating Elegant Architecture with Elysia.js, Elysia Decorators, and Supabase](https://medium.com/@anthonysabbagh03/integrating-elegant-architecture-with-elysia-js-elysia-decorators-and-supabase-28b92128abf0).

## Features

- Clean architecture: controllers, services, repositories, models, config
- Elysia decorators for dependency injection
- Supabase integration for data storage
- TypeScript for type safety

## Structure

```
elysia-todo-example/
  src/
    controllers/
    services/
    repositories/
    models/
    config/
    app.ts
```

## Running the App

1. Install dependencies:
   ```sh
   cd packages/elysia-app
   bun install # or npm install or pnpm install
   ```
2. Set your Supabase credentials in `src/config/supabase.ts`.
3. Start the server:
   ```sh
   bun run dev # or npm run dev or pnpm run dev
   ```

## Endpoints

- `GET /todos` - List all todos
- `POST /todos` - Create a todo
- `DELETE /todos/:id` - Delete a todo

---

Inspired by the Medium article above.
