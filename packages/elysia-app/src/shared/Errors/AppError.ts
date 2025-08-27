export interface IAppError {
  error: string;
  statusCode?: number;
}

export function isAppError(exception: unknown): exception is IAppError {
  return exception instanceof Error && exception.name === 'AppError';
}

export class AppError extends Error {
  public error: string;
  public statusCode: number;

  constructor({ error, statusCode = 500 }: IAppError) {
    super(error);
    this.name = 'AppError';
    this.error = error;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
