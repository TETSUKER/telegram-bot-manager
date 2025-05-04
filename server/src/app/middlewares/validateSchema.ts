import { ServerResponse } from 'node:http';
import { Request } from 'app/interfaces/http.interfaces';
import { NextFunction } from 'app/interfaces/middleware.interfaces';
import { ValidationError } from 'app/errors/validation.error';
import { ZodType } from 'zod';

export const validateSchema = (schema: ZodType) => async (
  req: Request,
  _: ServerResponse,
  next: NextFunction,
) => {
  try {
    schema.parse(req.body);
    next();
  } catch(err) {
    throw new ValidationError('Error validate body', err);
  }
};
