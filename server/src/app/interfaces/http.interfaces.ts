import { IncomingMessage, ServerResponse } from 'http';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Request extends IncomingMessage {
  body?: Record<string, unknown>;
  params?: Record<string, string | null>;
  query?: Record<string, string>;
}

export type RequestCallback = (req: Request, res: ServerResponse) => void;
