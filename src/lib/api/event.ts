import { EventItem, ShowTimeItem } from "@/types/event";
import { API_BASE_URL } from "./base";

export async function getEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch Event.");
  }

  return json.data ?? json;
}

export async function getEventById(eventId: string): Promise<EventItem> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch event detail.");
  }

  return json.data ?? json;
}

export async function getShowTimesByEventId(
  eventId: string,
): Promise<ShowTimeItem[]> {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/show-times`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch show times.");
  }

  return json.data ?? json;
}
