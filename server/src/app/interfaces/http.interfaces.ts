import { IncomingMessage, ServerResponse } from 'http';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestCallback = (req: IncomingMessage, res: ServerResponse) => void;
