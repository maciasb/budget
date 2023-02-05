export async function makeRequest<T>(
  path: string,
  args: RequestInit = { method: "GET" }
): Promise<T> {
  const request = new Request(`${"http://localhost:3001"}${path}`, args);
  const response = await fetch(request);
  const body = await response.json();
  return body;
}
