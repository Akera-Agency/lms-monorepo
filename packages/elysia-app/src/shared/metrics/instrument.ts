import * as Sentry from '@sentry/bun';
import { env } from '@akera/env';

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  attachStacktrace: true,
  beforeSendTransaction(event) {
    const status = event.contexts?.trace?.data?.['http.status_code'];
    const unwanted_status = [404];
    if ((status && unwanted_status.includes(status)) || env.LOCAL) {
      return null;
    } else {
      return event;
    }
  },
  ignoreErrors: [
    'unauthenticated',
    // 'permission_denied',
    // 'not_found',
    // 'invalid_argument',
    'Unable to compile TypeScript',
  ],
  ignoreTransactions: ['Create Nest App'],
  release: '1.0.0',
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/bun/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
