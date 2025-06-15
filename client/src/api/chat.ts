import { baseUrl } from './baseUrl';

export interface ServerChat {
  id: number;
  chatId: string;
  name: string;
  dateAdded: string;
}

export async function getChats(): Promise<ServerChat[]> {
  const path = baseUrl + '/getChats';
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify({}),
  });

  return response.json();
}
