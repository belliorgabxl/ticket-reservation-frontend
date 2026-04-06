import { getEventById, getShowTimesByEventId } from "@/lib/api/event";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  const [event, showTimes] = await Promise.all([
    getEventById(id),
    getShowTimesByEventId(id),
  ]);

  console.log("event log", showTimes);
  console.log("event log 2: ", event);
  return (
    <main className="w-full p-6">
      <div className="grid grid-cols-3 items-start">
        <Link
          href="/events"
          className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded-lg w-fit h-fit"
        >
          Back to Events
        </Link>

        <h1 className="mb-6 text-2xl text-center font-bold">Event Detail</h1>
      </div>

      <div className="m-auto max-w-2xl">
        <div className="rounded-xl border border-gray-100 p-5 shadow-md bg-gray-100">
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p className="mt-2 text-gray-700">{event.venueName}</p>
          <p className="text-gray-700">{event.eventDate}</p>
        </div>

        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Show Times</h2>

          {showTimes.length === 0 ? (
            <div className="rounded-xl border border-gray-100 p-4 shadow-md bg-gray-100">
              <p className="text-gray-600">No show times available.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {showTimes.map((showTime) => (
                <div
                  key={showTime.id}
                  className="rounded-xl border border-gray-100 p-4 shadow-md bg-gray-100 hover:bg-gray-50"
                >
                  <p className="font-medium">
                    {showTime.starts_at.slice(0, 11)}
                  </p>

                  <div className="mt-4">
                    <Link
                      href={`/show-times/${showTime.id}/seats`}
                      className="rounded-lg bg-red-700 hover:bg-red-900 px-4 py-2 text-white"
                    >
                      Select Seats
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
