/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query OrdersList($payload: FilterGetInput!) {\n    orders(payload: $payload) {\n      items {\n        _id\n        userId\n        totalUsd\n        status\n        providerRef\n        createdAt\n      }\n      meta {\n        skip\n        take\n        total\n      }\n    }\n  }\n": typeof types.OrdersListDocument,
    "\n  query UsersList($payload: FilterGetInput!) {\n    users(payload: $payload) {\n      items {\n        _id\n        email\n        name\n        role\n        isActive\n      }\n      meta {\n        total\n      }\n    }\n  }\n": typeof types.UsersListDocument,
    "\n  mutation OrderCreate($payload: OrderCreateInput!) {\n    orderCreate(payload: $payload) {\n      _id\n      status\n      totalUsd\n    }\n  }\n": typeof types.OrderCreateDocument,
};
const documents: Documents = {
    "\n  query OrdersList($payload: FilterGetInput!) {\n    orders(payload: $payload) {\n      items {\n        _id\n        userId\n        totalUsd\n        status\n        providerRef\n        createdAt\n      }\n      meta {\n        skip\n        take\n        total\n      }\n    }\n  }\n": types.OrdersListDocument,
    "\n  query UsersList($payload: FilterGetInput!) {\n    users(payload: $payload) {\n      items {\n        _id\n        email\n        name\n        role\n        isActive\n      }\n      meta {\n        total\n      }\n    }\n  }\n": types.UsersListDocument,
    "\n  mutation OrderCreate($payload: OrderCreateInput!) {\n    orderCreate(payload: $payload) {\n      _id\n      status\n      totalUsd\n    }\n  }\n": types.OrderCreateDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OrdersList($payload: FilterGetInput!) {\n    orders(payload: $payload) {\n      items {\n        _id\n        userId\n        totalUsd\n        status\n        providerRef\n        createdAt\n      }\n      meta {\n        skip\n        take\n        total\n      }\n    }\n  }\n"): (typeof documents)["\n  query OrdersList($payload: FilterGetInput!) {\n    orders(payload: $payload) {\n      items {\n        _id\n        userId\n        totalUsd\n        status\n        providerRef\n        createdAt\n      }\n      meta {\n        skip\n        take\n        total\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsersList($payload: FilterGetInput!) {\n    users(payload: $payload) {\n      items {\n        _id\n        email\n        name\n        role\n        isActive\n      }\n      meta {\n        total\n      }\n    }\n  }\n"): (typeof documents)["\n  query UsersList($payload: FilterGetInput!) {\n    users(payload: $payload) {\n      items {\n        _id\n        email\n        name\n        role\n        isActive\n      }\n      meta {\n        total\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation OrderCreate($payload: OrderCreateInput!) {\n    orderCreate(payload: $payload) {\n      _id\n      status\n      totalUsd\n    }\n  }\n"): (typeof documents)["\n  mutation OrderCreate($payload: OrderCreateInput!) {\n    orderCreate(payload: $payload) {\n      _id\n      status\n      totalUsd\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;