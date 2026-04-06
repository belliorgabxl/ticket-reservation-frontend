import { API_BASE_URL } from "./base";

export type HoldSeatsPayload = {
  userId: string;
  showTimeId: string;
  seatIds: string[];
};

export type HoldSeatsResponse = {
  heldSeatIds: string[];
  failedSeatIds: string[];
  expiresInSec: number;
  isPartial?: boolean;
};

export async function holdSeats(
  payload: HoldSeatsPayload,
): Promise<HoldSeatsResponse> {
  const res = await fetch(`${API_BASE_URL}/holds/seats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "failed to hold seats");
  }

  return json.data ?? json;
}

export async function releaseSeats(payload: HoldSeatsPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/holds/seats`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "failed to release seats");
  }
}
