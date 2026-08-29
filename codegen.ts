import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Типы и типизированные документы из СХЕМЫ БЭКЕНДА.
 *
 * Запускать при поднятом бэкенде: `pnpm codegen`. Схема читается по HTTP,
 * потому что источник правды — работающий сервер, а не файл, который кто-то
 * забыл обновить.
 *
 * Сгенерированное коммитится: сборка фронта не должна зависеть от того,
 * поднят ли сейчас бэкенд.
 */
const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:9800/gql": {
        headers: {
          "x-api-key": process.env.BACKEND_API_KEY ?? "local-admin-key",
          // Бэкенд закрыт service-token'ом — codegen тоже клиент и тоже
          // обязан его прислать. Иначе схема не читается, а сообщение
          // («Invalid service token») выглядит как проблема codegen.
          "x-service-token": process.env.BACKEND_SERVICE_TOKEN ?? "dev-service-token",
        },
      },
    },
  ],
  documents: ["src/**/*.{ts,tsx}", "!src/generated/**/*"],
  ignoreNoDocuments: true,
  generates: {
    "src/generated/gql/": {
      preset: "client",
      config: { skipTypename: true },
    },
  },
};

export default config;
