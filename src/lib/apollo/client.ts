import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

/**
 * Apollo смотрит в СВОЙ же `/api/graphql`, а не в бэкенд.
 *
 * Отсюда следует три приятных вещи: адреса бэкенда нет в бандле, CORS не нужен
 * (запрос same-origin), а httpOnly-кука сессии уезжает автоматически — значит
 * не нужен и authLink, который на клиенте всё равно пришлось бы кормить
 * токеном из localStorage. Токенов в localStorage тут нет вовсе, и это
 * не аскеза: localStorage читает любой скрипт на странице.
 */
function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: "/api/graphql", credentials: "same-origin" }),
    cache: new InMemoryCache(),
  });
}

let browserClient: ApolloClient | null = null;

/** Синглтон в браузере, свежий инстанс на сервере — иначе кэш утечёт между
 * запросами разных пользователей. */
export function getApolloClient() {
  if (typeof window === "undefined") return createApolloClient();
  browserClient ??= createApolloClient();
  return browserClient;
}
