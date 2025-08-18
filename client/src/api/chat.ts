import { baseUrl } from './baseUrl';

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
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify({}),
  });
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return response.json();
}

export async function addChat(body: NewChat): Promise<Response> {
  const path = baseUrl + '/addChat';
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return response;
}

export async function deleteChats(ids: number[]): Promise<Response> {
  const path = baseUrl + '/removeChat';
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify({ids}),
  });
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return response;
}

export async function updateChat(chat: UpdateChat): Promise<Response> {
  const path = baseUrl + '/updateChat';
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify({...chat}),
  });
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return response;
}
