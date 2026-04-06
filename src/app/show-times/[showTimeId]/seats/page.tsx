"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { SeatItem } from "@/types/seat";
import { getSeatByShowTimeID } from "@/lib/api/seats";
import { createReservation } from "@/lib/api/reservation";
import { holdSeats } from "@/lib/api/hold";

const MOCK_USER_ID = "user-001";

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
  const [error, setError] = useState("");

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
        userId: MOCK_USER_ID,
        showTimeId,
        seatIds: selectedSeatIds,
      });

      setExpiresInSec(res.expiresInSec);
      await loadSeats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to hold seats");
    } finally {
      setHolding(false);
    }
  }

  async function onCreateReservation() {
    if (selectedSeatIds.length === 0) return;

    setCreating(true);
    setError("");

    try {
      const res = await createReservation({
        userId: MOCK_USER_ID,
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

  return (
    <main className=" max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Select Seats</h1>

      {error ? <p className="mb-4 text-red-600">{error}</p> : null}

      {expiresInSec > 0 ? (
        <p className="mb-4 font-medium">Hold expires in: {expiresInSec}s</p>
      ) : null}

      {loading ? (
        <p>Loading seats...</p>
      ) : (
        <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
          {seats.map((seat) => {
            const selected = selectedSeatIds.includes(seat.seatId);

            return (
              <button
                key={seat.seatId}
                type="button"
                onClick={() => toggleSeat(seat)}
                disabled={seat.status !== "AVAILABLE"}
                className={`rounded-xl border p-3 text-sm ${
                  seat.status === "BOOKED"
                    ? "bg-red-100 text-red-500 font-semibold"
                    : seat.status === "HELD"
                      ? "bg-yellow-100 text-yellow-600 font-semibold"
                      : selected
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "bg-green-50"
                }`}
              >
                <div className="font-semibold">{seat.seatCode}</div>
                <div>{seat.price} THB</div>
                <div>{seat.status}</div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Selected</h2>
        <p className="mt-2">{selectedSeatIds.length || 0} seat</p>
        <p className="mt-2">Total: {totalPrice} THB</p>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onHoldSeats}
            disabled={selectedSeatIds.length === 0 || holding}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {holding ? "Holding..." : "Hold Seats"}
          </button>

          <button
            type="button"
            onClick={onCreateReservation}
            disabled={selectedSeatIds.length === 0 || creating}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Reservation"}
          </button>
        </div>
      </div>
    </main>
  );
}
