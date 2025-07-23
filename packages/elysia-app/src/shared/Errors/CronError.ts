import { Logger } from '../logger/logger';

export interface ICronError {
  error: Error;
}

export function isCronError(exception: unknown): exception is ICronError {
  return exception instanceof Error && exception.name === 'CronError';
}

export class CronError extends Error {
  public error: Error;

  constructor(error: any) {
    super(error);
    this.name = 'CronError';
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
    Logger.error(
      'CronError - ' + error?.toString(),
      error instanceof Error ? error.stack : ''
    );
  }
}
