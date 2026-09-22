const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://vibemeet-8xxp.onrender.com';

export async function api(path, body, method = 'POST') {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  const url = path.startsWith('http')
    ? path
    : `${API_URL}${path}`;

  const res = await fetch(url, opts);

  const text = await res.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg =
      (data && data.error) ||
      `Request failed (${res.status})`;

    throw new Error(msg);
  }

  return data;
}
