import { ServerResponse } from 'node:http';
import { Request } from 'app/interfaces/http.interfaces';

export type NextFunction = (err?: any) => void;

export type Middleware = (
  req: Request,
  res: ServerResponse,
  next: NextFunction,
) => Promise<void> | void;
