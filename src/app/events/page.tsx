import { getEvents } from "@/lib/api/event";
import Link from "next/link";
import Card from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <Link href="/" className={buttonClasses("secondary", "sm")}>
          Back to Home
        </Link>
      </div>

      {events.length === 0 ? (
        <Card className="p-6 text-center text-muted">
          No events available right now.
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col gap-3 p-5 transition hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{event.name}</h2>
                <p className="text-sm text-muted">{event.venueName}</p>
                <p className="text-sm text-muted">{event.eventDate}</p>
              </div>

              <Link
                href={`/events/${event.id}`}
                className={buttonClasses("primary", "sm", "shrink-0")}
              >
                View Show Times
              </Link>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
