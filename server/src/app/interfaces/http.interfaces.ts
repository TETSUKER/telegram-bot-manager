import { IncomingMessage, ServerResponse } from 'http';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestCallback = (req: IncomingMessage, res: ServerResponse) => void;

export interface Request extends IncomingMessage {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}
