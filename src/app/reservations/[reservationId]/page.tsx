"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Reservation } from "@/types/reservation";
import { getReservationById } from "@/lib/api/reservation";
import Card from "@/components/ui/card";
import Badge, { statusTone } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";

export default function ReservationPage() {
  const params = useParams<{ reservationId: string }>();
  const reservationId = params.reservationId;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getReservationById(reservationId);
        if (!cancelled) setReservation(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "failed to load reservation",
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

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-muted">Loading reservation...</p>
      </main>
    );
  }

  if (error || !reservation) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error || "reservation not found"}
        </p>
      </main>
    );
  }

  const total = reservation.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Reservation Summary
        </h1>
        <Badge tone={statusTone(reservation.status)}>
          {reservation.status}
        </Badge>
      </div>

      <Card className="p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Reservation ID</dt>
            <dd className="font-mono text-xs">{reservation.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Expires at</dt>
            <dd>{reservation.expiresAt}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="mb-4 text-lg font-semibold">Seats</h2>

        <div className="space-y-2">
          {reservation.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="font-medium">{item.seatCode}</span>
              <span className="text-muted">{item.price} THB</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{total} THB</span>
        </div>
      </Card>

      <div className="mt-6">
        {reservation.status === "HOLDING" ? (
          <Link
            href={`/payments/${reservation.id}`}
            className={buttonClasses("primary", "md")}
          >
            Proceed to Payment
          </Link>
        ) : reservation.status === "CONFIRMED" ? (
          <Link
            href={`/tickets/${reservation.id}`}
            className={buttonClasses("primary", "md")}
          >
            View Tickets
          </Link>
        ) : null}
      </div>
    </main>
  );
}
