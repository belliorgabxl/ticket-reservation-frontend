import { getReservationById } from "@/lib/api/reservation";

type PageProps = {
  params: Promise<{ reservationId: string }>;
};

export default async function ReservationPage({ params }: PageProps) {
  const { reservationId } = await params;
  const reservation = await getReservationById(reservationId);

  const total = reservation.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Reservation Summary</h1>

      <div className="rounded-xl border p-4">
        <p>
          <strong>Reservation ID:</strong> {reservation.id}
        </p>
        <p>
          <strong>Status:</strong> {reservation.status}
        </p>
        <p>
          <strong>Expires At:</strong> {reservation.expiresAt}
        </p>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="mb-4 text-lg font-semibold">Seats</h2>

        <div className="space-y-3">
          {reservation.items.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              <p>
                <strong>{item.seatCode}</strong>
              </p>
              <p>{item.price} THB</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-lg font-semibold">Total: {total} THB</p>
      </div>
    </main>
  );
}
