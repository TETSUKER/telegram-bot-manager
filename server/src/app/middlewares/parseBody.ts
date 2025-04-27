import { ServerResponse } from 'node:http';
import { Request } from 'app/interfaces/http.interfaces';
import { NextFunction } from 'app/interfaces/middleware.interfaces';

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
      if (body) {
        req.body = JSON.parse(body);
        next();
      }
    });
  } else {
    next();
  }
};
