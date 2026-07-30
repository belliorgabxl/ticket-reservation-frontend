import { getEventById, getShowTimesByEventId } from "@/lib/api/event";
import Link from "next/link";
import Card from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  const [event, showTimes] = await Promise.all([
    getEventById(id),
    getShowTimesByEventId(id),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Event Detail</h1>
        <Link href="/events" className={buttonClasses("secondary", "sm")}>
          Back to Events
        </Link>
      </div>

      <Card className="p-5">
        <h2 className="text-xl font-semibold">{event.name}</h2>
        <p className="mt-2 text-muted">{event.venueName}</p>
        <p className="text-muted">{event.eventDate}</p>
      </Card>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Show Times</h2>

        {showTimes.length === 0 ? (
          <Card className="p-5 text-muted">No show times available.</Card>
        ) : (
          <div className="grid gap-4">
            {showTimes.map((showTime) => (
              <Card
                key={showTime.id}
                className="flex flex-col gap-3 p-5 transition hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="font-medium">{showTime.starts_at.slice(0, 11)}</p>

                <Link
                  href={`/show-times/${showTime.id}/seats`}
                  className={buttonClasses("primary", "sm", "shrink-0")}
                >
                  Select Seats
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
