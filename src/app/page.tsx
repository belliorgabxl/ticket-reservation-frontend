import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { getEvents } from "@/lib/api/event";
import type { EventItem } from "@/types/event";

const STEPS = [
  {
    title: "Browse & pick seats",
    body: "Explore live shows and pick your exact seat on the map.",
  },
  {
    title: "Hold & reserve",
    body: "Your seat is held for a few minutes while you confirm.",
  },
  {
    title: "Pay & get your ticket",
    body: "Checkout securely and your ticket code is issued instantly.",
  },
];

export default async function Home() {
  let events: EventItem[] = [];
  try {
    events = (await getEvents()).slice(0, 3);
  } catch {
    // Homepage should still render even if the API is briefly unreachable.
  }

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-105 w-105 -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-3xl"
        />

        <span className="mb-4 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          Live shows, real seats
        </span>

        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Book your next concert in a few taps
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-balance text-muted">
          Browse upcoming shows, pick your exact seat, and check out securely
          — from hold to ticket in one smooth flow.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/events" className={buttonClasses("primary", "md")}>
            Browse Events
          </Link>
          <Link href="/register" className={buttonClasses("secondary", "md")}>
            Create an account
          </Link>
        </div>
      </section>

      {/* Now booking */}
      {events.length > 0 ? (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-bold tracking-tight">Now booking</h2>
            <Link
              href="/events"
              className="text-sm font-medium text-accent hover:underline"
            >
              See all events →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="h-full p-5 transition hover:border-accent/40 hover:shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {event.eventDate}
                  </span>
                  <h3 className="mt-2 font-semibold">{event.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {event.venueName}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* How it works */}
      <section className="border-t border-border bg-surface/50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-xl font-bold tracking-tight">
            How it works
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center sm:text-left">
                <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent sm:mx-0">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
