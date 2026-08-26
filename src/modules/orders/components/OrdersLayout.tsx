import type { JSX, ReactNode } from "react";

import { PageContainer } from "@/components/PageContainer";

type OrdersLayoutProps = {
  children: ReactNode;
};

/** Shared page chrome for the order-history list and order-detail pages. */
export function OrdersLayout({ children }: OrdersLayoutProps): JSX.Element {
  return (
    <PageContainer size="md" py={{ base: 6, md: 10 }}>
      {children}
    </PageContainer>
  );
}
