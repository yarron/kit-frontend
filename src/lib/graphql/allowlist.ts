import "server-only";

import { type DocumentNode, Kind, parse, print, visit } from "graphql";

import * as operations from "./operations";

/**
 * Список разрешённых операций для BFF.
 *
 * БЕЗ него `/api/graphql` — открытый прокси: любой посетитель шлёт через него
 * в бэкенд произвольный GraphQL, и прокси заботливо подставляет service-token.
 * Интроспекция схемы, чужие ручки, самодельные запросы — всё пройдёт.
 *
 * Allowlist пускает ТОЛЬКО документы из operations.ts. Всё остальное режется
 * ЗДЕСЬ, до того как запрос уйдёт в приватную сеть.
 */

/**
 * Канонизация: parse → print (единое форматирование) + убрать `__typename`
 * (Apollo дописывает его на клиенте, а наши документы — нет) + схлопнуть
 * пробелы. Так серверная и клиентская форма одной операции совпадают.
 *
 * Сравнивать сырые строки нельзя: лишний перенос строки в запросе — и
 * легальная операция отвергнута.
 */
export function canonicalize(query: string): string | null {
  try {
    const ast = parse(query);
    const stripped = visit(ast, {
      Field(node) {
        if (node.name.value === "__typename") return null;
      },
    });
    return print(stripped).replace(/\s+/g, " ").trim();
  } catch {
    // Невалидный GraphQL. Не ошибка сервера — просто не пройдёт дальше;
    // отдельного лога не нужно, вызывающий вернёт 400 с текстом.
    return null;
  }
}

function isDocument(value: unknown): value is DocumentNode {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as DocumentNode).kind === Kind.DOCUMENT
  );
}

const ALLOWED: Set<string> = (() => {
  const set = new Set<string>();
  for (const value of Object.values(operations)) {
    if (!isDocument(value)) continue;
    const canon = canonicalize(print(value));
    if (canon) set.add(canon);
  }
  return set;
})();

/**
 * `true` — операция входит в список приложения.
 *
 * Пустой список = запрещено всё (fail-closed). Обратное поведение — «список
 * не собрался, пропускаем всё» — превращает опечатку в импорте в открытый
 * прокси.
 */
export function isAllowedOperation(query: string): boolean {
  if (ALLOWED.size === 0) return false;
  const canon = canonicalize(query);
  return canon != null && ALLOWED.has(canon);
}

/** Для диагностики: сколько операций в списке. */
export const allowedOperationCount = (): number => ALLOWED.size;
