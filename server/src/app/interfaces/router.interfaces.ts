import { RequestCallback, RequestMethod } from './http.interfaces';

export interface Routes {
  [path: string]: {
    [method in RequestMethod]?: RequestCallback;
  };
}
