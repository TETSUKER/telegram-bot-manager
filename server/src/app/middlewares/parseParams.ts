import { ServerResponse } from 'node:http';
import { Request } from 'app/interfaces/http.interfaces';
import { NextFunction } from 'app/interfaces/middleware.interfaces';
import { getFullUrl } from 'app/utils/getFullUrl';

export const parseParams = async (
  req: Request,
  _: ServerResponse,
  next: NextFunction,
) => {
  const fullUrl = getFullUrl(req);
  const parsedUrl = new URL(fullUrl);
  req.params = {}; 

  for (const key of parsedUrl.searchParams.keys()) {
    req.params[key] = parsedUrl.searchParams.get(key);
  }

  next();
};
