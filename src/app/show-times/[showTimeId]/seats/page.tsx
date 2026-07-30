"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { SeatItem } from "@/types/seat";
import { getSeatByShowTimeID } from "@/lib/api/seats";
import { createReservation } from "@/lib/api/reservation";
import { holdSeats, releaseSeats } from "@/lib/api/hold";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function SeatsPage() {
  const params = useParams<{ showTimeId: string }>();
  const router = useRouter();

  const showTimeId = params.showTimeId;

  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [expiresInSec, setExpiresInSec] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [holding, setHolding] = useState(false);
  const [creating, setCreating] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [error, setError] = useState("");
  // Tracks exactly which seat IDs are currently held by *this* user, so the
  // "continue" step only ever submits a set the backend will accept —
  // changing the selection after holding (or letting the hold expire)
  // invalidates it and sends the user back through "Hold Seats" first.
  const [heldSeatIds, setHeldSeatIds] = useState<string[]>([]);

  const hasActiveHold =
    expiresInSec > 0 &&
    heldSeatIds.length === selectedSeatIds.length &&
    heldSeatIds.every((id) => selectedSeatIds.includes(id));

  async function loadSeats() {
    setLoading(true);
    setError("");

    try {
      const data = await getSeatByShowTimeID(showTimeId);
      setSeats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to load seats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSeats();
  }, [showTimeId]);

  useEffect(() => {
    if (expiresInSec <= 0) return;

    const timer = window.setInterval(() => {
      setExpiresInSec((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresInSec]);

  function toggleSeat(seat: SeatItem) {
    if (seat.status !== "AVAILABLE") return;

    // Changing the selection invalidates any prior hold — the backend only
    // accepts a reservation for exactly the seats it currently has held for
    // this user, so force a re-hold rather than letting "Continue" submit a
    // stale set and fail with a confusing error.
    setHeldSeatIds([]);

    setSelectedSeatIds((prev) =>
      prev.includes(seat.seatId)
        ? prev.filter((id) => id !== seat.seatId)
        : [...prev, seat.seatId],
    );
  }

  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedSeatIds.includes(seat.seatId)),
    [seats, selectedSeatIds],
  );

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  async function onHoldSeats() {
    if (selectedSeatIds.length === 0) return;

    setHolding(true);
    setError("");

    try {
      const res = await holdSeats({
        showTimeId,
        seatIds: selectedSeatIds,
      });

      setExpiresInSec(res.expiresInSec);
      setHeldSeatIds(res.heldSeatIds);

      if (res.isPartial) {
        setError(
          `Some seats were already taken and could not be held: ${res.failedSeatIds.join(", ")}. Deselect them or try again.`,
        );
      }

      await loadSeats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to hold seats");
    } finally {
      setHolding(false);
    }
  }

  async function onCreateReservation() {
    if (!hasActiveHold) return;

    setCreating(true);
    setError("");

    try {
      const res = await createReservation({
        showTimeId,
        seatIds: selectedSeatIds,
      });

      router.push(`/reservations/${res.reservationId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "failed to create reservation",
      );
    } finally {
      setCreating(false);
    }
  }

  async function onReleaseSeats() {
    if (heldSeatIds.length === 0) return;

    setReleasing(true);
    setError("");

    try {
      await releaseSeats({ showTimeId, seatIds: heldSeatIds });
      setHeldSeatIds([]);
      setExpiresInSec(0);
      setSelectedSeatIds([]);
      await loadSeats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to release seats");
    } finally {
      setReleasing(false);
    }
  }

  const seatStyles: Record<SeatItem["status"] | "SELECTED", string> = {
    AVAILABLE: "border-border bg-surface hover:border-accent/50",
    SELECTED: "border-green-500 bg-green-100 text-green-800",
    HELD: "border-warning/30 bg-warning/10 text-warning cursor-not-allowed",
    BOOKED: "border-danger/30 bg-danger/10 text-danger cursor-not-allowed",
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Select Seats</h1>

      {error ? (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-border bg-surface" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-accent bg-accent/10" />
              Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-warning/30 bg-warning/10" />
              Held
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-danger/30 bg-danger/10" />
              Booked
            </span>
          </div>

          {loading ? (
            <p className="text-muted">Loading seats...</p>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {seats.map((seat) => {
                const selected = selectedSeatIds.includes(seat.seatId);
                const styleKey =
                  seat.status === "AVAILABLE" && selected
                    ? "SELECTED"
                    : seat.status;

                return (
                  <button
                    key={seat.seatId}
                    type="button"
                    onClick={() => toggleSeat(seat)}
                    disabled={seat.status !== "AVAILABLE"}
                    className={`rounded-xl border p-3 text-left text-sm font-medium transition ${seatStyles[styleKey]}`}
                  >
                    <div className="font-semibold">{seat.seatCode}</div>
                    <div className="text-xs opacity-80">
                      {seat.price} THB
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            <h2 className="text-lg font-semibold">Your selection</h2>

            {selectedSeats.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                Tap a seat on the map to select it.
              </p>
            ) : (
              <ul className="mt-3 space-y-1.5 text-sm">
                {selectedSeats.map((seat) => (
                  <li
                    key={seat.seatId}
                    className="flex justify-between text-foreground"
                  >
                    <span>{seat.seatCode}</span>
                    <span className="text-muted">{seat.price} THB</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
              <span>Total</span>
              <span>{totalPrice} THB</span>
            </div>

            {hasActiveHold ? (
              <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
                ✓ Held — expires in {expiresInSec}s. Continue below to
                reserve &amp; pay.
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Step 1: hold your seats. Step 2 unlocks once they&apos;re
                held.
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={onHoldSeats}
                disabled={selectedSeatIds.length === 0 || holding}
              >
                {holding ? "Holding..." : "1. Hold Seats"}
              </Button>

              <Button
                variant="secondary"
                onClick={onCreateReservation}
                disabled={!hasActiveHold || creating}
                title={
                  hasActiveHold ? undefined : "Hold your selected seats first"
                }
              >
                {creating ? "Creating..." : "2. Continue to Reservation"}
              </Button>

              {heldSeatIds.length > 0 ? (
                <Button
                  variant="ghost"
                  onClick={onReleaseSeats}
                  disabled={releasing}
                  className="text-danger hover:bg-danger/10"
                >
                  {releasing ? "Releasing..." : "Release hold"}
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
