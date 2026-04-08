import { NextResponse } from "next/server";

import { PobClientError } from "@/server/pob/errors";

export async function withRouteResult<T>(action: () => Promise<T>) {
  try {
    const result = await action();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    if (error instanceof PobClientError) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            retryable: error.retryable,
          },
        },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Unexpected server error";

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message,
        },
      },
      { status: 500 },
    );
  }
}
