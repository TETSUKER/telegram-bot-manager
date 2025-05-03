import { IncomingMessage, ServerResponse } from 'http';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Request<T = any> extends IncomingMessage {
  body?: T;
  params?: Record<string, string | null>;
  query?: Record<string, string>;
}

export type RequestCallback<T = any> = (req: Request<T>, res: ServerResponse) => Promise<void>;
