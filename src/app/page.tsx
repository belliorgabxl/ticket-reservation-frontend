import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full my-10 grid place-items-center">
        <Link
          href="/events"
          className="text-xl text-white bg-red-500 w-fit rounded-lg 
      py-2 px-10 "
        >
          Event Check
        </Link>
      </div>
    </div>
  );
}
