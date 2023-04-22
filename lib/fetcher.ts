export async function fetcher(url: RequestInfo, init?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const { message } = await res.json();

    throw new Error(message);
  }

  return res.json();
}
