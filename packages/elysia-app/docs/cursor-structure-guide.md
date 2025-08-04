## Cursor Rules for Modular Elysia + Kysely Backend

### Module Folder Convention

- Each entity lives in `src/modules/{entity}`
- Each module must include:

  - `infrastructure/{entity}.entity.ts`
  - `infrastructure/{entity}.repository.ts`
  - `{entity}.service.ts`
  - `{entity}.controller.ts`
  - `{entity}.module.ts`

---

### Entity Rules (`infrastructure/{entity}.entity.ts`)

- Define the `Kysely{Entity}` interface based on the database table schema.
- Export the following:

  - `Entity`: `Selectable<KyselyEntity>`
  - `NewEntity`: `Insertable<KyselyEntity>`
  - `UpdateEntity`: `Updateable<KyselyEntity>`
  - `QueryEntity`: `BaseQuery<KyselyEntity>`

- Use `ColumnType<Date, Date | undefined, never>` for timestamps.

---

### Repository Rules (`infrastructure/{entity}.repository.ts`)

- Extend `BaseRepo<KyselyEntity>`
- Constructor must accept `trx: Kysely<IDb>`
- All methods should:

  - Use `try/catch` and wrap errors in `PostgresError`
  - Enforce `deleted_at IS NULL` for soft deletes
  - Handle pagination via `findManyWithPagination()` using `infinityPagination()`

- Include methods: `create`, `update`, `delete`, `findOne`, `findAll`
- Use `this.trx` exclusively for database operations

---

### BaseRepo Rules

- Accepts `trx` and `entityName` to generalize table logic
- Expose generic methods:

  - `findMany`, `findOne`, `createOne`, `updateOne`, `deleteOne`, `createMany`, `deleteMany`

- Types:

  - `FindManyArgs`, `UpdateArgs`
  - Use `COMPARISON_OPERATORS` for filtering

---

### Service Rules (`{entity}.service.ts`)

- Accept the repository instance through constructor and pass to `super()`
- Should not contain business logic; only calls to the repository
- All inputs should match types from `entity.ts` (`NewEntity`, `QueryEntity`, etc.)

---

### Controller Rules (`{entity}.controller.ts`)

- Define REST endpoints using Elysia:

  - `GET /` for paginated list
  - `GET /:id` for single item
  - `POST /` for creation
  - `PUT /:id` for updates
  - `DELETE /:id` for deletion

- Use `t.Object` for validation
- Access services through `ctx.store.{ServiceName}`
- Prefix routes with `/${pluralEntityName}`

---

### Module Registration (`{entity}.module.ts`)

- Must satisfy `BaseModule` structure:

  ```ts
  export const entityModule = {
    repositories: {
      EntityRepository: { import: EntityRepository },
    },
    services: {
      EntityService: {
        import: EntityService,
        inject: [EntityRepository],
      },
    },
    controllers: [entityController],
  } satisfies BaseModule;
  ```

---

### General Rules

- Naming:

  - Classes use PascalCase; variables and instances use camelCase
  - File names must match the entity

- All queries must handle soft deletes via `deleted_at IS NULL`
- Use `infinityPagination()` for consistent paginated results
- Do not include database logic in services or controllers
- Rely on dependency injection and composition over static calls
