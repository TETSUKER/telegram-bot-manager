import { ApiError } from './api.error';

export class NotFoundError extends ApiError {
  constructor(message: string, details?: any) {
    super(404, message, details);
  }
}
