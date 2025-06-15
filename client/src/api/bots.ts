import { baseUrl } from './baseUrl';

export interface ServerBot {
  id: number;
  token: string;
  username: string;
  ruleIds: number[];
  dateAdded: Date;
  firstName: string;
  canJoinGroups: boolean;
  canReadAllGroupMessages: boolean;
  supportsInlineQueries: boolean;
  canConnectToBusiness: boolean;
  hasMainWebApp: boolean;
  lastUpdateId: number;
}

export async function getBots(): Promise<ServerBot[]> {
  const path = baseUrl + '/getBots';
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify({}),
  });

  return response.json();
}
