import { createPinoLogger } from '@bogeychan/elysia-logger';

export const Logger = createPinoLogger({
  level: 'info',
  timestamp: true,
  enabled: true,
  serializers: {
    req: (req) => {
      delete req.headers;
      delete req.body;
      return req;
    },
    err: (err) => {
      if (!err) return err;
      return {
        type: err.constructor?.name || 'Error',
        message: err.message,
        stack: err.stack,
        ...(err.code ? { code: err.code } : {}),
        ...(err.status ? { status: err.status } : {}),
      };
    },
  },
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          destination: `./logs/api/output-${new Date().toDateString()}.log`,
          mkdir: true,
          colorize: true,
          singleLine: true,
        },
      },
      {
        target: 'pino-pretty',
        options: {
          destination: process.stdout.fd,
          singleLine: true,
        },
      },
    ],
  },
});

// Sensitive keys that should never be logged
const SENSITIVE_KEYS = new Set([
  // API keys and tokens
  'apiKey',
  'api_key',
  'key',
  'secret',
  'token',
  'password',
  'credentials',
  'auth',
  'jwt',
  // OpenAI specific
  '_options',
  // RabbitMQ specific
  '_events',
  '_eventsCount',
  'connection',
  'stream',
  'channels',
  'serverProperties',
  // Headers often contain sensitive info
  // "headers",
  // "authorization",
]);

// Services that should be simplified
const SIMPLIFIED_SERVICES = new Set(['stripe', 'openai', 'rmq', 'mailer', 'storage', 'database']);

// Create a simplified version of an object that may contain circular references
function safeStringify(obj: any, seen = new WeakSet(), depth = 0): any {
  // Limit recursion depth
  if (depth > 3) {
    return '[Max Depth Exceeded]';
  }

  // For primitive types, return as is
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (seen.has(obj)) {
    return '[Circular Reference]';
  }
  seen.add(obj);

  // Handle common built-in objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (obj instanceof Error) {
    return {
      name: obj.name,
      message: obj.message,
      stack: obj.stack,
    };
  }
  if (Array.isArray(obj)) {
    // Limit array size to prevent huge logs
    if (obj.length > 10) {
      return [
        ...obj.slice(0, 3).map((item) => safeStringify(item, seen, depth + 1)),
        `[...${obj.length - 6} more items...]`,
        ...obj.slice(-3).map((item) => safeStringify(item, seen, depth + 1)),
      ];
    }
    return obj.map((item) => safeStringify(item, seen, depth + 1));
  }

  // Stripe client
  if (obj.VERSION && obj._api && (obj.account || obj.charges || obj.customers)) {
    return { type: 'StripeClient', initialized: true, version: obj.VERSION };
  }

  // For regular objects, process each property
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    // Skip sensitive keys
    if (SENSITIVE_KEYS.has(key)) {
      result[key] = '[REDACTED]';
      continue;
    }

    // Simplify service objects
    if (SIMPLIFIED_SERVICES.has(key) && typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = {
        type: key.charAt(0).toUpperCase() + key.slice(1),
        initialized: true,
      };
      continue;
    }

    // Skip Stripe circular references
    if (key === '_stripe' || key === '_client') {
      result[key] = '[Internal Reference - Hidden]';
      continue;
    }

    // Process remaining properties
    try {
      result[key] = safeStringify(obj[key], seen, depth + 1);
    } catch (e) {
      result[key] = '[Too Complex To Serialize]';
      Logger.error(e);
    }
  }

  return result;
}

// Helper function to safely prepare objects for logging
function sanitizeForLogging(args: any[]) {
  // Don't process empty arrays
  if (!args.length) return args;

  // If first arg is a string (message) and there are other args
  if (typeof args[0] === 'string' && args.length > 1) {
    // Keep the message string, process other args
    return [
      args[0],
      ...args.slice(1).map((arg) => {
        if (typeof arg === 'object' && arg !== null) {
          return safeStringify(arg);
        }
        return arg;
      }),
    ];
  }

  // Otherwise just process all args
  return args.map((arg) => {
    if (typeof arg === 'object' && arg !== null) {
      return safeStringify(arg);
    }
    return arg;
  });
}

// Apply sanitization to all logger methods
const methods = ['info', 'error', 'warn', 'debug', 'trace', 'fatal'] as const;

// Override each method with a sanitizing wrapper
methods.forEach((method) => {
  const original = Logger[method];
  Logger[method] = function (...args: any[]) {
    try {
      const sanitizedArgs = sanitizeForLogging(args);
      return original.apply(this, sanitizedArgs as any);
    } catch (e) {
      // If sanitization fails, log with simplified error info
      return original.call(this, `${method.toUpperCase()} logging failed`, String(e));
    }
  };
});
