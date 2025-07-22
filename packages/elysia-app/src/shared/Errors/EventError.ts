export interface IEventError {
  error: Error;
}

export function isEventError(exception: unknown): exception is IEventError {
  return exception instanceof Error && exception.name === "EventError";
}

export class EventError extends Error {
  public error: Error;

  constructor(error: any) {
    super(error);
    this.name = "EventError";
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
