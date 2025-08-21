import { baseUrl } from './baseUrl';
import { parseResponse } from './parseResponse';

export interface ServerChat {
  id: number;
  chatId: string;
  name: string;
  dateAdded: string;
}

export interface NewChat {
  name: string;
  chatId: string;
}

export interface UpdateChat {
  id: number;
  chatId?: string;
  name?: string;
}

export async function getChats(): Promise<ServerChat[]> {
  const path = baseUrl + '/getChats';

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({}),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return await parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}

export async function addChat(body: NewChat): Promise<Response> {
  const path = baseUrl + '/addChat';

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return await parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}

export async function deleteChats(ids: number[]): Promise<Response> {
  const path = baseUrl + '/removeChat';

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ids}),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return await parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}

export async function updateChat(chat: UpdateChat): Promise<Response> {
  const path = baseUrl + '/updateChat';

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({...chat}),
    });
    // await new Promise(resolve => setTimeout(resolve, 1000));
    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return await parseResponse(response);
    }
  } catch(err) {
    throw err;
  }
}
