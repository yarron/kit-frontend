import "server-only";

import { cookies } from "next/headers";

import { isAllowedOperation } from "./allowlist";

/**
 * Единственное место, где приложение ходит в бэкенд.
 *
 * Топология BFF: браузер НИКОГДА не обращается к NestJS напрямую. Он бьёт
 * в свой же `/api/graphql` (same-origin), а этот модуль форвардит запрос
 * по приватной сети + service-token.
 *
 * Что это даёт:
 *  — адрес бэкенда не существует в публичном интернете и его нет в бандле;
 *  — identity ставит СЕРВЕР из httpOnly-куки, браузер её подделать не может;
 *  — CORS не нужен вовсе: запрос same-origin.
 *
 * Чего это НЕ даёт (и врать себе тут не надо): всё, что умеет отправить
 * браузер, умеет отправить и curl по тому же `/api/graphql`. Прокси прячет
 * адрес и добавляет слой, но не превращает публичное API в приватное.
 * Поэтому — allowlist операций, лимиты и авторизация на бэкенде.
 *
 * ⚠️ Расплата за топологию: **GraphQL-подписки через прокси не работают**.
 * Route Handler — это запрос-ответ, а не долгоживущий сокет. Нужны подписки —
 * либо отдельный публичный WS-эндпоинт бэкенда (и тогда прятать его уже
 * незачем), либо SSE/поллинг. Для публичных проектов на массовую аудиторию
 * подписки нужны редко, и размен обычно верный — но выбирать его надо
 * осознанно, до того как половина фич завязана на live-обновления.
 */

const BACKEND_URL = process.env.BACKEND_GRAPHQL_URL;
const SERVICE_TOKEN = process.env.BACKEND_SERVICE_TOKEN ?? "";
const API_KEY = process.env.BACKEND_API_KEY ?? "";
const DEV_USER_ID = process.env.DEV_USER_ID ?? "";

export interface GraphQLResult<T = unknown> {
  data?: T | null;
  errors?: Array<{ message: string }>;
}

/**
 * Кто спрашивает. Реальный проект берёт userId из подписанной сессии
 * (Auth.js / next-auth); здесь — из httpOnly-куки, поставленной сервером,
 * с dev-фолбэком.
 *
 * Важно: заголовок X-User-Id ставит ТОЛЬКО сервер. Браузер его прислать
 * не может — а если пришлёт, мы его игнорируем, потому что берём значение
 * из куки, а не из входящих заголовков.
 */
async function resolveUserId(): Promise<string | null> {
  try {
    const store = await cookies();
    const fromSession = store.get("uid")?.value;
    if (fromSession) return fromSession;
  } catch (error) {
    // Вне request-контекста (сборка, скрипт) куки недоступны — это не ошибка,
    // но и молчать нельзя: правило проекта.
    console.debug(
      `resolveUserId: сессия недоступна (${error instanceof Error ? error.message : error})`,
    );
  }
  return DEV_USER_ID || null;
}

export async function runGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  operationName?: string,
): Promise<GraphQLResult<T>> {
  if (!isAllowedOperation(query)) {
    return { errors: [{ message: "Operation not allowed." }] };
  }

  if (!BACKEND_URL) {
    return { errors: [{ message: "BACKEND_GRAPHQL_URL is not configured." }] };
  }

  const userId = await resolveUserId();

  const upstream = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(SERVICE_TOKEN ? { "X-Service-Token": SERVICE_TOKEN } : {}),
      ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      ...(userId ? { "X-User-Id": userId } : {}),
    },
    body: JSON.stringify({ query, variables, operationName }),
    // Данные пользователя не кэшируются на краю. Кэш здесь — это чужие
    // данные, показанные не тому человеку.
    cache: "no-store",
  });

  return (await upstream.json()) as GraphQLResult<T>;
}
