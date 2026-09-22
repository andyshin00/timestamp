export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
}

export async function register(email: string, password: string): Promise<void> {
  const res = await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
}

export async function getMe(): Promise<{ email: string }> {
  const res = await fetch("/api/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
