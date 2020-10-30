export class RestError extends Error {
  constructor(error) {
    super(error.message);
    this.error = error;
  }

  error: Error;

  responseName: string;

  responseCode: number;

  responseMessage: string;
}

export class RestServerError extends RestError {
  constructor(error, responseMessage) {
    super(error);
    this.responseName = 'ServerError';
    this.responseCode = 500;
    this.responseMessage = responseMessage
      || 'An unexpected server error occurred. Please try again or contact support.';
  }
}

export class RestValidationError extends RestError {
  constructor(error, responseMessage) {
    super(error);
    this.responseName = 'ValidationError';
    this.responseCode = 400;
    this.responseMessage = responseMessage
      || 'Invalid input passed to rest endpoint.';
  }
}
