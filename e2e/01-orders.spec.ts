import { expect, test } from "@playwright/test";
import {
  attachDiagnostics,
  collectRequestHosts,
  waitForOperation,
} from "./helpers";

/**
 * Путь пользователя по списку заказов.
 *
 * Что здесь проверяется и почему именно браузером: страница собирается из
 * серверного компонента и клиентского Apollo, ходит через BFF-прокси и
 * применяет фильтр к запросу. Ни unit, ни e2e бэкенда этой цепочки не видят —
 * каждый из них проверяет свой кусок и ничего не знает про остальные.
 */
test.describe("Список заказов", () => {
  test.beforeEach(({ page }) => {
    attachDiagnostics(page);
  });

  test("страница открывается и показывает таблицу", async ({ page }) => {
    await page.goto("/orders");

    await expect(page.getByRole("heading", { name: "Заказы" })).toBeVisible();

    // Локаторы СЕМАНТИЧЕСКИЕ: роль и текст, а не CSS-класс. Класс — это
    // деталь оформления, он поменяется при первом же редизайне, и тест
    // упадёт на том, что ничего не сломалось.
    await expect(
      page.getByRole("columnheader", { name: "Статус" }),
    ).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("фильтр отправляет НОВЫЙ запрос и меняет выдачу", async ({ page }) => {
    await page.goto("/orders");
    await waitForOperation(page, "OrdersList");

    const rows = page.locator("tbody tr td:nth-child(4)");
    await expect(rows.first()).toBeVisible();

    // Фильтруем по статусу, который в выдаче ТОЧНО есть, — берём его
    // из первой строки. Захардкоженное значение делает тест зависимым
    // от того, какие данные оказались в базе на этой машине.
    const known = (await rows.first().innerText()).trim();

    // Ждём именно ответ на смену фильтра, а не «немножко поспать».
    // Ожидание по времени — самый частый источник флаков: на медленной
    // машине его не хватает, на быстрой оно просто тратит время прогона.
    const [response] = await Promise.all([
      waitForOperation(page, "OrdersList"),
      page.getByRole("combobox").selectOption(known),
    ]);

    // Проверяем не только экран, но и то, ЧТО ушло на сервер: фильтр,
    // который нарисовался, но не доехал до запроса, выглядит одинаково
    // с работающим, пока данных мало.
    const sent = response.request().postDataJSON();
    expect(JSON.stringify(sent.variables)).toContain(known);

    const statuses = await rows.allInnerTexts();

    // ⚠️ ЭТА строка — не формальность. Без неё тест был ложно-зелёным:
    // на фильтре, который не вернул ничего, цикл ниже не выполняется
    // ни разу, и проверка «все строки нужного статуса» проходит
    // на пустой таблице. Поймано фальсификацией: я подставил статус,
    // которого в данных нет, и тест остался зелёным.
    expect(statuses.length).toBeGreaterThan(0);

    for (const status of statuses) {
      expect(status.trim()).toBe(known);
    }
  });

  test("браузер НЕ ходит в бэкенд напрямую", async ({ page }) => {
    // Ради этой проверки браузерный тест и нужен. Топология обещает, что
    // адреса бэкенда нет ни в бандле, ни в сети клиента, — и проверить
    // обещание можно только посмотрев, куда реально ходила страница.
    const hosts = collectRequestHosts(page);

    await page.goto("/orders");
    await waitForOperation(page, "OrdersList");
    await page.waitForLoadState("networkidle");

    const backendPort = new URL(
      process.env.BACKEND_GRAPHQL_URL || "http://localhost:9800/gql",
    ).port;

    for (const host of hosts) {
      expect(host, `страница ходила на ${host}`).not.toContain(
        `:${backendPort}`,
      );
    }
    expect([...hosts]).toContain("localhost:3800");
  });
});
