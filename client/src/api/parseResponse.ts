export async function parseResponse(response: Response): Promise<any> {
  return response.headers.get("content-type") === "application/json"
    ? await response.json()
    : await response.text();
}
