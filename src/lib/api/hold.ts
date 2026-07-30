import { API_BASE_URL } from "./base";

export type HoldSeatsPayload = {
  showTimeId: string;
  seatIds: string[];
};

export type HoldSeatsResponse = {
  heldSeatIds: string[];
  failedSeatIds: string[];
  expiresInSec: number;
  isPartial?: boolean;
};

// userId is never sent from the client — the backend derives it from the
// authenticated session cookie (see RequireAuth on the Go side).
export async function holdSeats(
  payload: HoldSeatsPayload,
): Promise<HoldSeatsResponse> {
  const res = await fetch(`${API_BASE_URL}/holds/seats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  const res = await fetch(`${API_BASE_URL}/holds/seats/release`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "failed to release seats");
  }
}
