export enum PostgresErrorCode {
  UniqueViolation = '23505',
  ForeignKeyViolation = '23503',
  NotNullViolation = '23502',
  CheckViolation = '23514',
}

export interface DatabaseError {
  message: string;
  stack: string;
  name: 'PostgresError';
  code: PostgresErrorCode;
  detail: string;
  column?: string;
  table: string;
}

export function isDatabaseError(exception: unknown): exception is DatabaseError {
  return exception instanceof Error && exception.name === 'PostgresError';
}

export class PostgresError extends Error {
  code: string;
  detail: string;
  column: string;
  table: string;
  constructor(error: DatabaseError | unknown) {
    const typedError = error as DatabaseError;
    super(typedError.message);
    this.name = 'PostgresError';
    this.code = typedError.code || '';
    this.detail = typedError.detail || '';
    this.column = typedError.column || '';
    this.table = typedError.table || '';
    // This line maintains proper stack trace (only available in V8 environments)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PostgresError);
    }
  }
}
