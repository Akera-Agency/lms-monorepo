import { PostHog } from 'posthog-node';
import { env } from '@akera/env';

export const posthog = new PostHog(env.POSTHOG_API_KEY, {
  host: 'https://us.i.posthog.com',
});
