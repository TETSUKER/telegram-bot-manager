import { ApiError } from './api.error';

export class ServerApiError extends ApiError {
  constructor(message: string, details?: any) {
    super(500, message, details);
  }
}
