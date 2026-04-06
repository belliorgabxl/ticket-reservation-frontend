export type EventItem = {
  id: string;
  name: string;
  venueName: string;
  eventDate: string;
};

export type ShowTimeItem = {
  id: string;
  event_id: string;
  starts_at: string;
};