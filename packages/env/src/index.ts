import { z } from 'zod';
import { loadSharedEnv } from './utils';

// ---- Zod schema: comprehensive schema including all packages
export const baseSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),

  // Postgres Database
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POOLER_TENANT_ID: z.string().min(1),

  // Server Configuration
  PORT: z.coerce.number().int().positive().default(3000),
  LOCAL: z.coerce.boolean().default(false),

  // Supabase Core
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1),

  // Supabase Additional (from supabase package)
  // JWT_SECRET: z.string().min(1),
  // ANON_KEY: z.string().min(1),
  // SERVICE_ROLE_KEY: z.string().min(1),
  // DASHBOARD_USERNAME: z.string().min(1),
  // DASHBOARD_PASSWORD: z.string().min(1),
  // SECRET_KEY_BASE: z.string().min(1),
  // VAULT_ENC_KEY: z.string().min(1),

  // Supavisor Database Pooler
  POOLER_PROXY_PORT_TRANSACTION: z.coerce
    .number()
    .int()
    .positive()
    .default(6543),
  POOLER_DEFAULT_POOL_SIZE: z.coerce.number().int().positive().default(20),
  POOLER_MAX_CLIENT_CONN: z.coerce.number().int().positive().default(100),
  POOLER_DB_POOL_SIZE: z.coerce.number().int().positive().default(5),

  // API Proxy (Kong)
  KONG_HTTP_PORT: z.coerce.number().int().positive().default(8000),
  KONG_HTTPS_PORT: z.coerce.number().int().positive().default(8443),

  // API (PostgREST)
  PGRST_DB_SCHEMAS: z.string().default('public,storage,graphql_public'),

  // Auth (GoTrue)
  SITE_URL: z.string().url().default('http://localhost:3000'),
  ADDITIONAL_REDIRECT_URLS: z
    .string()
    .default('http://localhost:3000/auth/callback'),
  JWT_EXPIRY: z.coerce.number().int().positive().default(3600),
  DISABLE_SIGNUP: z.coerce.boolean().default(false),
  API_EXTERNAL_URL: z.string().url().default('http://localhost:8000'),

  // Mailer Config
  MAILER_URLPATHS_CONFIRMATION: z.string().default('/auth/v1/verify'),
  MAILER_URLPATHS_INVITE: z.string().default('/auth/v1/verify'),
  MAILER_URLPATHS_RECOVERY: z.string().default('/auth/v1/verify'),
  MAILER_URLPATHS_EMAIL_CHANGE: z.string().default('/auth/v1/verify'),

  // Email Auth
  ENABLE_EMAIL_SIGNUP: z.coerce.boolean().default(true),
  ENABLE_EMAIL_AUTOCONFIRM: z.coerce.boolean().default(false),
  SMTP_ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  SMTP_HOST: z.string().default('supabase-mail'),
  SMTP_PORT: z.coerce.number().int().positive().default(2500),
  SMTP_USER: z.string().default('fake_mail_user'),
  SMTP_PASS: z.string().default('fake_mail_password'),
  SMTP_SENDER_NAME: z.string().default('fake_sender'),
  ENABLE_ANONYMOUS_USERS: z.coerce.boolean().default(false),

  // Phone Auth
  ENABLE_PHONE_SIGNUP: z.coerce.boolean().default(true),
  ENABLE_PHONE_AUTOCONFIRM: z.coerce.boolean().default(true),

  // Studio Dashboard
  STUDIO_DEFAULT_ORGANIZATION: z.string().default('Default Organization'),
  STUDIO_DEFAULT_PROJECT: z.string().default('Default Project'),
  STUDIO_PORT: z.coerce.number().int().positive().default(3000),
  SUPABASE_PUBLIC_URL: z.string().url().default('http://localhost:8000'),
  IMGPROXY_ENABLE_WEBP_DETECTION: z.coerce.boolean().default(true),
  OPENAI_API_KEY: z.string().optional(),

  // Functions
  FUNCTIONS_VERIFY_JWT: z.coerce.boolean().default(false),

  // Logs/Analytics
  LOGFLARE_PUBLIC_ACCESS_TOKEN: z
    .string()
    .default('your-super-secret-and-long-logflare-key-public'),
  LOGFLARE_PRIVATE_ACCESS_TOKEN: z
    .string()
    .default('your-super-secret-and-long-logflare-key-private'),
  DOCKER_SOCKET_LOCATION: z.string().default('/var/run/docker.sock'),
  GOOGLE_PROJECT_ID: z.string().default('GOOGLE_PROJECT_ID'),
  GOOGLE_PROJECT_NUMBER: z.string().default('GOOGLE_PROJECT_NUMBER'),
  GOTRUE_EXTERNAL_GOOGLE_ENABLED: z.coerce.boolean().default(false),

  // Resend Email Service
  RESEND_DOMAIN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),

  // Notifications
  NOTIFS_DEBUG: z.coerce.boolean().default(false),

  // Sentry Error Tracking
  // SENTRY_DSN: z.string().url().or(z.literal('')).optional(),

  // PostHog Analytics
  POSTHOG_API_KEY: z.string().min(1),

  // S3 Storage
  S3_BUCKET_NAME: z.string().min(1),
  S3_ENDPOINT: z.string().url(),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),

  // Client-safe variables (for frontend apps)
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Vite Environment Variables (for frontend apps)
  VITE_ANON_KEY: z.string().optional(),
  VITE_API_EXTERNAL_URL: z.string().url().optional(),
  VITE_AUTH_APP: z.string().url().optional(),
  VITE_USER_APP: z.string().url().optional(),
});

export const schema = baseSchema.superRefine((v, ctx) => {
  if (v.NODE_ENV === 'production' && v.LOCAL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['LOCAL'],
      message: 'LOCAL must be false in production',
    });
  }
});

// Convenience flags and types
export const env = loadSharedEnv();
