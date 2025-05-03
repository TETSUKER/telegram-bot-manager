import { ApiError } from './api.error';

export class ExternalApiError extends ApiError {
  constructor(message: string, details?: any) {
    super(502, message, details);
  }
}
