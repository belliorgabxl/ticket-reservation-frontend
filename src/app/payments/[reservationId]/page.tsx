"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Reservation } from "@/types/reservation";
import { getReservationById } from "@/lib/api/reservation";
import { createPayment } from "@/lib/api/payment";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function PaymentPage() {
  const params = useParams<{ reservationId: string }>();
  const router = useRouter();
  const reservationId = params.reservationId;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
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

  async function onPay() {
    setPaying(true);
    setError("");

    try {
      await createPayment(reservationId);
      router.push(`/tickets/${reservationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error || "reservation not found"}
        </p>
      </main>
    );
  }

  const total = reservation.items.reduce((sum, item) => sum + item.price, 0);

  if (reservation.status === "CONFIRMED") {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <Card className="p-6 text-center">
          <p className="mb-4 text-muted">
            This reservation has already been paid.
          </p>
          <Link href={`/tickets/${reservationId}`} className="text-accent">
            View tickets →
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Payment</h1>

      {error ? (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Card className="p-5">
        <h2 className="mb-3 text-lg font-semibold">Order summary</h2>
        <div className="space-y-2 text-sm">
          {reservation.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.seatCode}</span>
              <span className="text-muted">{item.price} THB</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{total} THB</span>
        </div>
      </Card>

      <p className="mt-4 rounded-lg bg-accent/5 px-3 py-2 text-sm text-muted">
        This uses a simulated payment provider — no real card details are
        collected, and the charge always succeeds.
      </p>

      <Button onClick={onPay} disabled={paying} className="mt-6 w-full">
        {paying ? "Processing payment..." : `Pay ${total} THB`}
      </Button>
    </main>
  );
}
