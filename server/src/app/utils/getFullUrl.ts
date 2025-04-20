import { Request } from 'app/interfaces/http.interfaces';

export function getFullUrl(req: Request): string {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const path = req.url;

  return `${protocol}://${host}${path}`;
}
