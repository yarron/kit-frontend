import { graphql } from "@/generated/gql";

/**
 * ВСЕ операции приложения — в одном файле, и объявлены через `graphql()`,
 * а не через `gql`.
 *
 * Разница принципиальная. `gql` возвращает просто документ: TypeScript про
 * него ничего не знает, и тип ответа приходится писать руками — то есть
 * ГАДАТЬ. `graphql()` — функция, сгенерированная из твоей схемы: она
 * возвращает типизированный документ, и тип результата выводится из САМОГО
 * запроса, поле в поле.
 *
 * Этот же файл — источник allowlist'а BFF (см. allowlist.ts). Операция,
 * которой здесь нет, физически не пройдёт через прокси.
 */

export const ORDERS_LIST = graphql(`
  query OrdersList($payload: FilterGetInput!) {
    orders(payload: $payload) {
      items {
        _id
        userId
        totalUsd
        status
        providerRef
        createdAt
      }
      meta {
        skip
        take
        total
      }
    }
  }
`);

export const USERS_LIST = graphql(`
  query UsersList($payload: FilterGetInput!) {
    users(payload: $payload) {
      items {
        _id
        email
        name
        role
        isActive
      }
      meta {
        total
      }
    }
  }
`);

export const ORDER_CREATE = graphql(`
  mutation OrderCreate($payload: OrderCreateInput!) {
    orderCreate(payload: $payload) {
      _id
      status
      totalUsd
    }
  }
`);
