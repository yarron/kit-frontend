import type { NextRequest } from "next/server";

import { runGraphQL } from "@/lib/graphql/execute";

/**
 * Единственная точка, через которую браузер получает данные.
 *
 * Тонкий: разобрать тело, проверить форму, отдать в `runGraphQL`. Вся политика
 * (allowlist, identity, service-token) живёт там — чтобы серверные компоненты
 * и этот роут ходили в бэкенд ОДНИМ путём, а не двумя похожими.
 */
export async function POST(req: NextRequest): Promise<Response> {
  let body: {
    query?: string;
    variables?: Record<string, unknown>;
    operationName?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { errors: [{ message: "Invalid JSON body" }] },
      { status: 400 },
    );
  }

  if (!body.query || typeof body.query !== "string") {
    return Response.json(
      { errors: [{ message: "Missing query" }] },
      { status: 400 },
    );
  }

  try {
    const result = await runGraphQL(
      body.query,
      body.variables,
      body.operationName,
    );
    return Response.json(result);
  } catch (error) {
    // Наружу — ничего конкретного: сообщение внутренней ошибки описывает
    // твою инфраструктуру. В логи (и в Sentry на реальном проекте) — всё.
    console.error("BFF upstream failed:", error);
    return Response.json(
      { errors: [{ message: "Upstream GraphQL unavailable" }] },
      { status: 502 },
    );
  }
}
