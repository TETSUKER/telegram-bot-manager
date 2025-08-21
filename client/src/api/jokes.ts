import { baseUrl } from "./baseUrl";
import { parseResponse } from './parseResponse';

export interface NewJoke {
  text: string;
}

export interface ServerJoke extends NewJoke {
  id: number;
  sendedChatIds: string[];
}

export interface UpdateJoke {
  id: number;
  text: string;
  sendedChatIds?: string[];
}

export async function getJokes(): Promise<ServerJoke[]> {
  const path = baseUrl + "/getJokes";

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

export async function updateJoke(joke: UpdateJoke): Promise<any> {
  const path = baseUrl + "/updateJoke";

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ ...joke }),
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

export async function createJoke(joke: NewJoke): Promise<any> {
  const path = baseUrl + "/addJoke";

  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ ...joke }),
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

export async function deleteJokes(ids: number[]): Promise<Response> {
  const path = baseUrl + '/removeJokes';

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
