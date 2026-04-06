import { SeatItem } from "@/types/seat";
import { API_BASE_URL } from "./base";

export async function getSeatByShowTimeID(
  showTimeID: string,
): Promise<SeatItem[]> {
  const res = await fetch(`${API_BASE_URL}/show-times/${showTimeID}/seats`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch Seat data.");
  }

  return json.data ?? json;
}
