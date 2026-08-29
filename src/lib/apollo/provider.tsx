"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { useMemo } from "react";

import { getApolloClient } from "./client";

/**
 * Оборачивает только ту часть дерева, которой нужны данные. Маркетинговые
 * страницы статичны, и тянуть в них Apollo — это лишний JS на первой загрузке
 * ради ничего.
 */
export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => getApolloClient(), []);
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
