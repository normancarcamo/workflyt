import is from './is';

export class HttpError extends Error {
  constructor(message, opts) {
    super(message);
    this.name = "HttpError";
    this.status = 500;
    this.code = 500;
    if (is.object(opts)) {
      for (let key in opts) {
        this[key] = opts[key];
      };
    };
    Error.captureStackTrace(this, HttpError);
  }
}
