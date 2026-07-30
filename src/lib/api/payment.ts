import type { PaymentResult } from "@/types/payment";
import type { Ticket } from "@/types/ticket";
import { API_BASE_URL } from "./base";

export async function createPayment(reservationId: string): Promise<PaymentResult> {
  const res = await fetch(`${API_BASE_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reservationId }),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "payment failed");
  }

  return json.data ?? json;
}

export async function getReservationTickets(reservationId: string): Promise<Ticket[]> {
  const res = await fetch(`${API_BASE_URL}/reservations/${reservationId}/tickets`, {
    credentials: "include",
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "failed to fetch tickets");
  }

  return json.data ?? json;
}
