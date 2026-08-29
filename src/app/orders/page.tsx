import { Shell } from "@/components/Shell";
import { ApolloProvider } from "@/lib/apollo/provider";

import { OrdersTable } from "./shared/OrdersTable";

export default function OrdersPage() {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Заказы</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 24px" }}>
        Данные из NestJS через BFF. Открой Network — увидишь запросы только на{" "}
        <code>/api/graphql</code>.
      </p>
      {/* Провайдер только вокруг того, что действительно ходит за данными. */}
      <ApolloProvider>
        <OrdersTable />
      </ApolloProvider>
    </Shell>
  );
}
