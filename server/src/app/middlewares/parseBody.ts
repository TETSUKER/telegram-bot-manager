import { ServerResponse } from 'node:http';
import { Request } from 'app/interfaces/http.interfaces';
import { NextFunction } from 'app/interfaces/middleware.interfaces';
import { ValidationError } from 'app/errors/validation.error';

export const parseBody = async (
  req: Request,
  _: ServerResponse,
  next: NextFunction,
) => {
  const hasBody = req.headers['content-length'] !== '0';

  if (hasBody) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        if (body) {
          req.body = JSON.parse(body);
          next();
        }
      } catch(err) {
        next(new ValidationError('Error then parse body', err));
      }
    });
  } else {
    next();
  }
};
