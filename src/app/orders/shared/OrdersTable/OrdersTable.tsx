"use client";

import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import {
  FilterFieldTypeEnum,
  FilterOperationEnum,
  OrderStatusEnum,
  type OrdersListQuery,
  SortDirectionEnum,
} from "@/generated/gql/graphql";
import { ORDERS_LIST } from "@/lib/graphql/operations";

import styles from "./OrdersTable.module.css";

const TAKE = 10;

/**
 * Тип строки выводится ИЗ ЗАПРОСА, а не пишется рядом с ним.
 *
 * Раньше здесь лежал руками написанный `interface Order` — и он врал
 * в двух местах сразу: `status` был `string` (а это enum), `providerRef`
 * объявлен обязательным (а схема говорит «может отсутствовать»).
 * TypeScript верил интерфейсу, потому что больше верить было нечему.
 */
type OrderRow = OrdersListQuery["orders"]["items"][number];

/** Значения фильтра — из схемы, а не строковые литералы. */
const STATUSES = [
  { value: "", label: "Все статусы" },
  ...Object.values(OrderStatusEnum).map((value) => ({ value, label: value })),
];

const usd = (n: number) =>
  n.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Таблица поверх generic-контракта бэкенда.
 *
 * Пагинация и фильтр собираются в тот же `FilterGetInput`, что принимают ВСЕ
 * списки бэкенда — поэтому компонент переносится на любую другую коллекцию
 * заменой запроса и колонок, без единой правки на сервере.
 */
export function OrdersTable() {
  const [skip, setSkip] = useState(0);
  const [status, setStatus] = useState<OrderStatusEnum | "">("");

  // Дженерик не нужен: тип выводится из типизированного документа.
  // Ошибка в имени переменной или в значении enum — ошибка компиляции,
  // а не 400 в рантайме.
  const { data, loading, error } = useQuery(ORDERS_LIST, {
    variables: {
      payload: {
        paginate: { skip, take: TAKE },
        sorts: [{ columnName: "createdAt", direction: SortDirectionEnum.Desc }],
        filters: status
          ? [
              {
                columnName: "status",
                operation: FilterOperationEnum.Equal,
                type: FilterFieldTypeEnum.String,
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

  /**
   * Apollo типизирует `data` как ЧАСТИЧНЫЕ данные, и это не придирка:
   * из кэша действительно может прийти объект без части полей.
   *
   * Поэтому вместо приведения типом отбираем строки, пригодные к отрисовке.
   * Рукописный интерфейс просто утверждал, что такого не бывает.
   */
  const items = (data?.orders?.items ?? []).filter(
    (row): row is OrderRow => typeof row?._id === "string",
  );
  const total = data?.orders?.meta?.total ?? 0;

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
            setStatus(e.target.value as OrderStatusEnum | "");
            // Сбрасываем страницу: иначе фильтр применён, а ты на пятой
            // странице результата, которого больше нет.
            setSkip(0);
          }}
        >
          {STATUSES.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
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
