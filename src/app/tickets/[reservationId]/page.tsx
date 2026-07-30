"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Ticket } from "@/types/ticket";
import { getReservationTickets } from "@/lib/api/payment";
import Badge, { statusTone } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";

export default function TicketsPage() {
  const params = useParams<{ reservationId: string }>();
  const reservationId = params.reservationId;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getReservationTickets(reservationId);
        if (!cancelled) setTickets(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "failed to load tickets",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reservationId]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-success"
          >
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Booking Confirmed
        </h1>
        <p className="mt-1 text-muted">
          Your payment was successful and the following tickets were issued.
        </p>
      </div>

      {loading ? <p className="text-center text-muted">Loading tickets...</p> : null}
      {error ? (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-center text-sm text-danger">
          {error}
        </p>
      ) : null}

      {!loading && !error && tickets.length === 0 ? (
        <p className="text-center text-muted">
          No tickets found for this reservation yet.
        </p>
      ) : null}

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="relative flex overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
          >
            <div className="flex-1 p-5">
              <p className="text-xs uppercase tracking-wide text-muted">
                Seat
              </p>
              <p className="mt-1 text-xl font-bold">{ticket.seatCode}</p>
              <Badge tone={statusTone(ticket.status)} className="mt-3">
                {ticket.status}
              </Badge>
            </div>

            <div className="relative flex w-40 flex-col items-center justify-center border-l border-dashed border-border p-5">
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-background"
              />
              <span
                aria-hidden
                className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-background"
              />
              <p className="text-center text-[10px] uppercase tracking-wide text-muted">
                Ticket code
              </p>
              <p className="mt-1 break-all text-center font-mono text-sm font-bold text-accent">
                {ticket.ticketCode}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/events" className={buttonClasses("secondary", "md")}>
          Back to events
        </Link>
      </div>
    </main>
  );
}
