import { RequestCallback, RequestMethod } from 'app/interfaces/http.interfaces';
import { Middleware } from './middleware.interfaces';

export interface Routes {
  [path: string]: {
    [method in RequestMethod]?: {
      callback: RequestCallback;
      middlewares: Middleware[];
    };
  };
}
