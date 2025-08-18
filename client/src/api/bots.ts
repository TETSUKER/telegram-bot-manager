import { baseUrl } from './baseUrl';
import { parseResponse } from './parseResponse';

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

export interface UpdateBot {
  id: number;
  ruleIds?: number[];
  lastUpdateId?: number;
}

export async function getBots(): Promise<ServerBot[]> {
  const path = baseUrl + '/getBots';

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({}),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}

export async function addBot(token: string): Promise<Response> {
  const path = baseUrl + '/addBot';
  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}

export async function deleteBots(ids: number[]): Promise<Response> {
  const path = baseUrl + '/removeBots';

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ids}),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}

export async function updateBot(bot: UpdateBot): Promise<Response> {
  const path = baseUrl + '/updateBot';
  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({...bot}),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}
