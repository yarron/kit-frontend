import type { Page } from "@playwright/test";

/**
 * Печатать то, что говорит само приложение: ошибки страницы, ошибки консоли
 * и любой ответ GraphQL, несущий `errors`.
 *
 * Это самый полезный приём во всём файле. Без него упавший прогон сообщает,
 * что «строка не появилась», — а сервер в этот момент отвечал с причиной,
 * и причина эта нигде не видна. Разбор превращается в гадание по скриншоту.
 */
export function attachDiagnostics(page: Page): void {
  page.on("pageerror", (error) => {
    console.error("[PAGE ERROR]", error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      console.error("[CONSOLE]", message.text().slice(0, 300));
    }
  });

  page.on("response", async (response) => {
    if (!response.url().includes("/api/graphql")) return;
    try {
      const body = await response.text();
      if (body.includes('"errors"')) {
        console.error("[GQL]", body.slice(0, 400));
      }
    } catch (error) {
      // Тело ответа уже недоступно — это нормально и ничего нам не говорит.
      // Диагностика НЕ имеет права ронять прогон, ради которого работает,
      // но и молчать не должна: пишем в debug и идём дальше.
      console.debug(
        "[GQL] тело ответа недоступно:",
        error instanceof Error ? error.message : error,
      );
    }
  });
}

/**
 * Дождаться одной операции GraphQL по имени.
 *
 * Ограничение по времени намеренное: мутация, которую форма отказалась
 * отправить (например, из-за валидации, которой прогон не видит), иначе
 * держала бы ожидание до таймаута всего теста — и падение приехало бы
 * минутой позже и не на том шаге.
 */
export function waitForOperation(
  page: Page,
  operationName: string,
  timeout = 15_000,
) {
  return page.waitForResponse(
    (response) =>
      response.url().includes("/api/graphql") &&
      response.request().postDataJSON()?.operationName === operationName,
    { timeout },
  );
}

/**
 * Собрать все хосты, к которым страница обращалась.
 *
 * Нужно для проверки, которую нельзя сделать никаким другим тестом: в нашей
 * топологии браузер обязан ходить ТОЛЬКО на свой домен, а с бэкендом говорит
 * серверная часть Next.js. Утечка адреса бэкенда в клиентский код видна
 * отсюда — и больше ниоткуда.
 */
export function collectRequestHosts(page: Page): Set<string> {
  const hosts = new Set<string>();
  page.on("request", (request) => {
    try {
      hosts.add(new URL(request.url()).host);
    } catch {
      // data:/blob: — не сетевые адреса, у них нет хоста. Пропускаем молча:
      // это не ошибка и логировать тут нечего.
    }
  });
  return hosts;
}
