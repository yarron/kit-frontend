import Link from "next/link";

import { Shell } from "@/components/Shell";

/**
 * Статическая страница: ни Apollo, ни `"use client"`. Отдаётся как HTML,
 * JS почти не грузит.
 */
export default function HomePage() {
  return (
    <Shell>
      <h1 style={{ fontSize: 30, lineHeight: 1.2, margin: "0 0 16px" }}>
        Фронт, который прячет бэкенд
      </h1>
      <p style={{ maxWidth: "62ch", color: "var(--muted)" }}>
        Браузер ходит только в <code>/api/graphql</code> этого же приложения.
        Next пересылает запрос в NestJS по приватной сети, добавляя
        service-token и идентичность пользователя из httpOnly-куки. Адреса
        бэкенда нет ни в бандле, ни в публичном DNS.
      </p>

      <h2 style={{ fontSize: 18, margin: "32px 0 8px" }}>Что посмотреть</h2>
      <ul style={{ maxWidth: "62ch", paddingLeft: 20 }}>
        <li>
          <Link href="/orders">Заказы</Link> — таблица с пагинацией и фильтром
          через тот же <code>FilterGetInput</code>, что у бэкенда.
        </li>
        <li>
          <code>src/lib/graphql/allowlist.ts</code> — почему прокси не открытый.
        </li>
        <li>
          <code>src/lib/graphql/execute.ts</code> — что даёт эта топология и
          чего она не даёт.
        </li>
      </ul>
    </Shell>
  );
}
