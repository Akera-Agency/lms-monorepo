export interface ErrorType {
  status: 422;
  value: {
    type: 'validation';
    on: string;
    summary?: string;
    message?: string;
    found?: unknown;
    property?: string;
    expected?: string;
  };
}
