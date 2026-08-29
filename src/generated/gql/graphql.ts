/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

/** Daily order aggregate */
export type DailyStatEntity = {
  day: Scalars['String']['output'];
  eventType: Scalars['String']['output'];
  events: Scalars['Int']['output'];
  totalUsd: Scalars['Float']['output'];
  users: Scalars['Int']['output'];
};

export enum FilterFieldTypeEnum {
  Boolean = 'Boolean',
  Date = 'Date',
  Number = 'Number',
  String = 'String'
}

export type FilterGetInput = {
  filters?: InputMaybe<Array<FilterInput>>;
  paginate?: InputMaybe<PaginateInput>;
  sorts?: InputMaybe<Array<SortInput>>;
};

export type FilterInput = {
  columnName: Scalars['String']['input'];
  operation: FilterOperationEnum;
  type: FilterFieldTypeEnum;
  value: Array<Scalars['String']['input']>;
};

export enum FilterOperationEnum {
  Contains = 'Contains',
  Equal = 'Equal',
  GreaterThanOrEqual = 'GreaterThanOrEqual',
  In = 'In',
  LessThanOrEqual = 'LessThanOrEqual',
  NotEqual = 'NotEqual'
}

export type InvoiceCreateInput = {
  amountUsd: Scalars['Float']['input'];
  orderId: Scalars['String']['input'];
};

/** Invoice for an order (PostgreSQL) */
export type InvoiceEntity = {
  amountUsd: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  orderId: Scalars['String']['output'];
  status: InvoiceStatusEnum;
  updatedAt: Scalars['DateTime']['output'];
};

export type InvoiceSetStatusInput = {
  id: Scalars['Int']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status: InvoiceStatusEnum;
};

export enum InvoiceStatusEnum {
  Draft = 'Draft',
  Issued = 'Issued',
  Paid = 'Paid',
  Void = 'Void'
}

export type InvoicesOutput = {
  items: Array<InvoiceEntity>;
  meta: MetaOutput;
};

export type MetaOutput = {
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Mutation = {
  invoiceCreate: InvoiceEntity;
  invoiceRemove: Scalars['Boolean']['output'];
  invoiceSetStatus: InvoiceEntity;
  /** Create an order (idempotent) */
  orderCreate: OrderEntity;
  /** Create a user */
  userCreate: UserEntity;
  /** Soft-delete a user */
  userDeactivate: UserEntity;
  /** Update a user */
  userUpdate: UserEntity;
};


export type MutationInvoiceCreateArgs = {
  payload: InvoiceCreateInput;
};


export type MutationInvoiceRemoveArgs = {
  id: Scalars['Int']['input'];
};


export type MutationInvoiceSetStatusArgs = {
  payload: InvoiceSetStatusInput;
};


export type MutationOrderCreateArgs = {
  payload: OrderCreateInput;
};


export type MutationUserCreateArgs = {
  payload: UserCreateInput;
};


export type MutationUserDeactivateArgs = {
  id: Scalars['String']['input'];
};


export type MutationUserUpdateArgs = {
  payload: UserUpdateInput;
};

export type OrderCreateInput = {
  idempotencyKey: Scalars['String']['input'];
  totalUsd: Scalars['Float']['input'];
  userId: Scalars['String']['input'];
};

/** Customer order */
export type OrderEntity = {
  _id: Scalars['String']['output'];
  attempts: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  fulfilledAt?: Maybe<Scalars['DateTime']['output']>;
  idempotencyKey: Scalars['String']['output'];
  lastError?: Maybe<Scalars['String']['output']>;
  providerRef?: Maybe<Scalars['String']['output']>;
  status: OrderStatusEnum;
  totalUsd: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

/** One immutable order event */
export type OrderEventEntity = {
  _id: Scalars['String']['output'];
  eventType: Scalars['String']['output'];
  occurredAt: Scalars['DateTime']['output'];
  orderId: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalUsd: Scalars['Float']['output'];
  userId: Scalars['String']['output'];
};

export enum OrderStatusEnum {
  Cancelled = 'Cancelled',
  Failed = 'Failed',
  Fulfilled = 'Fulfilled',
  Pending = 'Pending',
  Queued = 'Queued'
}

export type OrdersOutput = {
  items: Array<OrderEntity>;
  meta: MetaOutput;
};

export type PaginateInput = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type Query = {
  /** Aggregates for one day (YYYY-MM-DD) */
  dailyStats: Array<DailyStatEntity>;
  invoice?: Maybe<InvoiceEntity>;
  /** Paginated invoices (PostgreSQL) */
  invoices: InvoicesOutput;
  order?: Maybe<OrderEntity>;
  /** Event history of one order */
  orderEvents: Array<OrderEventEntity>;
  /** Paginated list of orders */
  orders: OrdersOutput;
  /** User by id */
  user?: Maybe<UserEntity>;
  /** Paginated list of users */
  users: UsersOutput;
};


export type QueryDailyStatsArgs = {
  day: Scalars['String']['input'];
};


export type QueryInvoiceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryInvoicesArgs = {
  payload: FilterGetInput;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrderEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['String']['input'];
};


export type QueryOrdersArgs = {
  payload: FilterGetInput;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  payload: FilterGetInput;
};

export enum SortDirectionEnum {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type SortInput = {
  columnName: Scalars['String']['input'];
  direction: SortDirectionEnum;
};

export type UserCreateInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role?: InputMaybe<UserRoleEnum>;
};

/** Application user */
export type UserEntity = {
  _id: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  role: UserRoleEnum;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRoleEnum {
  Admin = 'Admin',
  Customer = 'Customer'
}

export type UserUpdateInput = {
  id: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRoleEnum>;
};

export type UsersOutput = {
  items: Array<UserEntity>;
  meta: MetaOutput;
};

export type OrdersListQueryVariables = Exact<{
  payload: FilterGetInput;
}>;


export type OrdersListQuery = { orders: { items: Array<{ _id: string, userId: string, totalUsd: number, status: OrderStatusEnum, providerRef?: string | null, createdAt: any }>, meta: { skip: number, take: number, total: number } } };

export type UsersListQueryVariables = Exact<{
  payload: FilterGetInput;
}>;


export type UsersListQuery = { users: { items: Array<{ _id: string, email: string, name: string, role: UserRoleEnum, isActive: boolean }>, meta: { total: number } } };

export type OrderCreateMutationVariables = Exact<{
  payload: OrderCreateInput;
}>;


export type OrderCreateMutation = { orderCreate: { _id: string, status: OrderStatusEnum, totalUsd: number } };


export const OrdersListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrdersList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsd"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"providerRef"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<OrdersListQuery, OrdersListQueryVariables>;
export const UsersListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<UsersListQuery, UsersListQueryVariables>;
export const OrderCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OrderCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsd"}}]}}]}}]} as unknown as DocumentNode<OrderCreateMutation, OrderCreateMutationVariables>;