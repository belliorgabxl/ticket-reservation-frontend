import { getEvents } from "@/lib/api/event";
import Link from "next/link";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="w-full p-6">
      <div className="grid grid-cols-3">
        <Link
          href="/"
          className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded-lg w-fit h-fit"
        >
          Back to Home
        </Link>
        <h1 className="mb-6 text-2xl text-center font-bold">Events</h1>
      </div>

      <div className="m-auto max-w-2xl">
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-gray-100 p-4 shadow-md bg-gray-100 hover:bg-gray-50"
            >
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <p>{event.venueName}</p>
              <p>{event.eventDate}</p>

              <div className="mt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="rounded-lg bg-red-700 hover:bg-red-900 px-4 py-2 text-white"
                >
                  View Show Times
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
