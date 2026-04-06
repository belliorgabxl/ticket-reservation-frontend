import { Concert } from "@/types/concert";
import Link from "next/link";

type Props = {
  concert: Concert;
};

export default function ConcertCard({ concert }: Props) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <img
        src={concert.imageUrl}
        alt={concert.title}
        className="mb-3 h-48 w-full rounded-lg object-cover"
      />

      <h2 className="text-xl font-semibold">{concert.title}</h2>
      <p className="text-sm text-gray-600">{concert.venue}</p>
      <p className="text-sm text-gray-600">{concert.date}</p>
      <p className="mt-2 font-medium">เริ่มต้น {concert.startingPrice} บาท</p>

      <Link
        href={`/concerts/${concert.id}`}
        className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white"
      >
        ดูรายละเอียด
      </Link>
    </div>
  );
}
