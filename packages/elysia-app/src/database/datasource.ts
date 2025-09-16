import {
  Kysely,
  ParseJSONResultsPlugin,
  PostgresDialect,
  LogEvent,
} from 'kysely';
import { Pool } from 'pg';
import { IDb } from './types/IDb';
import { Logger } from 'src/shared/logger/logger';
import { env } from '@akera/env';

const connectionString = `postgresql://${env.POSTGRES_USER}.${env.POOLER_TENANT_ID}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

export const database = new Kysely<IDb>({
  plugins: [new ParseJSONResultsPlugin()],
  dialect: new PostgresDialect({
    onCreateConnection: async () => {
      Logger.info('db connected');
    },
    pool: new Pool({
      connectionString,
    }),
  }),
  log(event: LogEvent) {
    const query = event.query;
    if (event.level === 'query') {
      Logger.info(
        `Executed query: ${query.sql} ${
          query.parameters.length > 0 ? `with params:[${query.parameters}]` : ''
        } in ${event.queryDurationMillis} ms`
      );
    } else {
      Logger.error(
        `Executed query: ${query.sql} ${
          query.parameters.length > 0 ? `with params:[${query.parameters}]` : ''
        } in ${event.queryDurationMillis} ms`,
        event.error as undefined
      );
    }
  },
});
