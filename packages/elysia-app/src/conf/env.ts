import 'dotenv/config';
import z from 'zod';

const schema = z.object({
  // BUN
  NODE_ENV: z.enum(['production', 'development', 'test']),
  POSTGRES_PASSWORD: z.string().nonempty(),
  POSTGRES_HOST: z.string().nonempty(),
  POSTGRES_PORT: z.string().nonempty(),
  POSTGRES_DB: z.string().nonempty(),
  POSTGRES_USER: z.string().nonempty(),
  POOLER_TENANT_ID: z.string().nonempty(),

  // Elysia
  PORT: z.string().nonempty(),

  // Supabase
  SUPABASE_URL: z.string().nonempty(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().nonempty(),
});

export const env = schema.parse(
  process.env.NODE_ENV === 'test' ? Bun.env : process.env
);
