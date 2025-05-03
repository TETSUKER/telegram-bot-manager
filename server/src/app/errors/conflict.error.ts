import { ApiError } from './api.error';

export class ConflictError extends ApiError {
  constructor(message: string, details?: any) {
    super(409, message, details);
  }
}
