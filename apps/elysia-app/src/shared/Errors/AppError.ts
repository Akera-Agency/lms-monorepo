export interface IAppError {
  error: Error;
}

export function isAppError(exception: unknown): exception is IAppError {
  return exception instanceof Error && exception.name === 'AppError';
}

export class AppError extends Error {
  public error: Error;

  constructor(error: any) {
    super(error);
    this.name = 'AppError';
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
