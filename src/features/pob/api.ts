export type ApiSuccess<T> = { ok: true; result: T };

export type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    retryable?: boolean;
  };
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

async function parseResult<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResult<T>;

  if (!payload.ok) {
    throw new Error(`${payload.error.code}: ${payload.error.message}`);
  }

  return payload.result;
}

export async function apiGet<T>(url: string) {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseResult<T>(response);
}

export async function apiPost<T>(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body === undefined ? null : JSON.stringify(body),
    cache: "no-store",
  });

  return parseResult<T>(response);
}
