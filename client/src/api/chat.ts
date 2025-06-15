export interface ServerChat {
  id: number;
  chatId: string;
  name: string;
  dateAdded: string;
}

export async function getChats(): Promise<ServerChat[]> {
  const response = await fetch("http://localhost:3020/getChats", {
    method: "POST",
    body: JSON.stringify({}),
  });

  return response.json();
}
