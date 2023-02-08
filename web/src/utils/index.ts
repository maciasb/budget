export async function makeRequest<T>(
  path: string,
  method = 'GET',
  body = '',
): Promise<T> {
  const requestArgs: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (method !== 'GET') {
    requestArgs.body = body;
  }
  const request = new Request(`${'http://localhost:3001'}${path}`, requestArgs);
  const response = await fetch(request);
  const data = await response.json();
  return data;
}
