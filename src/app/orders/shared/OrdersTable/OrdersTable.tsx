"use client";

import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { ORDERS_LIST } from "@/lib/graphql/operations";

import styles from "./OrdersTable.module.css";

const TAKE = 10;

interface Order {
  _id: string;
  userId: string;
  totalUsd: number;
  status: string;
  providerRef: string | null;
  createdAt: string;
}

interface OrdersListData {
  orders: {
    items: Order[];
    meta: { skip: number; take: number; total: number };
  };
}

const STATUSES = ["", "Pending", "Queued", "Fulfilled", "Failed", "Cancelled"];

const usd = (n: number) =>
  n.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Таблица поверх generic-контракта бэкенда.
 *
 * Пагинация и фильтр собираются в тот же `FilterGetInput`, что принимают ВСЕ
 * списки бэкенда — поэтому этот компонент переносится на любую другую
 * коллекцию заменой запроса и колонок, без единой правки на сервере.
 */
export function OrdersTable() {
  const [skip, setSkip] = useState(0);
  const [status, setStatus] = useState("");

  const { data, loading, error } = useQuery<OrdersListData>(ORDERS_LIST, {
    variables: {
      payload: {
        paginate: { skip, take: TAKE },
        sorts: [{ columnName: "createdAt", direction: "Desc" }],
        filters: status
          ? [
              {
                columnName: "status",
                operation: "Equal",
                type: "String",
                value: [status],
              },
            ]
          : [],
      },
    },
    // Показываем прошлые строки, пока грузятся новые: иначе таблица моргает
    // пустотой на каждом переключении страницы.
    fetchPolicy: "cache-and-network",
  });

  const items = data?.orders.items ?? [];
  const total = data?.orders.meta.total ?? 0;

  if (error) {
    return (
      <div className={styles.error}>
        Не удалось загрузить: {error.message}
        <br />
        Проверь, что бэкенд поднят и в <code>.env.local</code> задан{" "}
        <code>BACKEND_GRAPHQL_URL</code>.
      </div>
    );
  }

  return (
    <>
      <div className={styles.controls}>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            // Сбрасываем страницу: иначе фильтр применён, а ты на пятой
            // странице результата, которого больше нет.
            setSkip(0);
          }}
        >
          {STATUSES.map((s) => (
            <option key={s || "all"} value={s}>
              {s || "Все статусы"}
            </option>
          ))}
        </select>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>
          всего: {total}
        </span>
      </div>

      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Провайдер</th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order._id}>
                <td className={styles.mono}>{order._id.slice(-8)}</td>
                <td>{order.userId}</td>
                <td>${usd(order.totalUsd)}</td>
                <td>{order.status}</td>
                <td className={styles.mono}>{order.providerRef ?? "—"}</td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td className={styles.state} colSpan={5}>
                  Пусто. Создай заказ через GraphQL playground бэкенда.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pager}>
        <button
          type="button"
          className={styles.button}
          disabled={skip === 0}
          onClick={() => setSkip(Math.max(0, skip - TAKE))}
        >
          Назад
        </button>
        <span>
          {total === 0 ? 0 : skip + 1}–{Math.min(skip + TAKE, total)} из {total}
        </span>
        <button
          type="button"
          className={styles.button}
          disabled={skip + TAKE >= total}
          onClick={() => setSkip(skip + TAKE)}
        >
          Вперёд
        </button>
        {loading && <span>обновляется…</span>}
      </div>
    </>
  );
}
