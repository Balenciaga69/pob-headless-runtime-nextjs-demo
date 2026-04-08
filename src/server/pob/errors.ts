export class PobClientError extends Error {
  code: string;
  details?: unknown;
  retryable?: boolean;

  constructor(message: string, options: { code: string; details?: unknown; retryable?: boolean }) {
    super(message);
    this.name = "PobClientError";
    this.code = options.code;
    this.details = options.details;
    this.retryable = options.retryable;
  }
}

export class PobWorkerBootError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PobWorkerBootError";
  }
}
