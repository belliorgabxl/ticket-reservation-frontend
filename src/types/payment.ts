import type { Ticket } from "./ticket";

export type OrderStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export type Order = {
  id: string;
  reservationId: string;
  userId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  provider: string;
  providerRef: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentResult = {
  order: Order;
  tickets: Ticket[];
};
