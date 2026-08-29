import { gql } from "@apollo/client";

/**
 * ВСЕ операции приложения — в одном файле.
 *
 * Это не про порядок: из этого файла строится allowlist BFF (см. allowlist.ts).
 * Операция, которой здесь нет, физически не пройдёт через прокси — а значит,
 * запрос, придуманный в браузерной консоли, до бэкенда не доедет.
 *
 * Цена: новую операцию надо добавить сюда, иначе она молча не работает.
 * Это осознанный размен — «забыл добавить» ловится на первом же клике,
 * а открытый прокси не ловится вообще.
 */

export const ORDERS_LIST = gql`
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
`;

export const USERS_LIST = gql`
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
`;

export const ORDER_CREATE = gql`
  mutation OrderCreate($payload: OrderCreateInput!) {
    orderCreate(payload: $payload) {
      _id
      status
      totalUsd
    }
  }
`;
