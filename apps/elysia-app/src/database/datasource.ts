import {
  Kysely,
  ParseJSONResultsPlugin,
  PostgresDialect,
  LogEvent,
} from 'kysely';
import { Pool } from 'pg';
import { IDb } from './types/IDb';
export const database = new Kysely<IDb>({
  plugins: [new ParseJSONResultsPlugin()],
  dialect: new PostgresDialect({
    onCreateConnection: async () => {
      console.log('db connected');
    },
    pool: new Pool({
      user: process.env.DATABASE_USERNAME,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: parseInt(process.env.DATABASE_PORT as string, 10),
    }),
  }),
  log(event: LogEvent) {
    const query = event.query;
    if (event.level === 'query') {
      console.log(
        `Executed query: ${query.sql} ${
          query.parameters.length > 0 ? `with params:[${query.parameters}]` : ''
        } in ${event.queryDurationMillis} ms`
      );
    } else {
      console.error(
        `Executed query: ${query.sql} ${
          query.parameters.length > 0 ? `with params:[${query.parameters}]` : ''
        } in ${event.queryDurationMillis} ms`,
        event.error
      );
    }
  },
});
