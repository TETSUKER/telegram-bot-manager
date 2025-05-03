import { ServerResponse } from 'node:http';
import { Request } from 'app/interfaces/http.interfaces';
import { NextFunction } from 'app/interfaces/middleware.interfaces';

export const writeHeadJson = async (
  _: Request,
  res: ServerResponse,
  next: NextFunction,
) => {
  res.setHeader('Content-Type', 'application/json');
  next();
};
