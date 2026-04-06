import { API_BASE_URL } from "./base";
import type { Reservation } from "@/types/reservation";

export async function createReservation(payload: {
  userId: string;
  showTimeId: string;
  seatIds: string[];
}) {
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "failed to create reservation");
  }

  return json.data ?? json;
}

export async function getReservationById(
  reservationId: string,
): Promise<Reservation> {
  const res = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "failed to fetch reservation");
  }

  return json.data ?? json;
}
