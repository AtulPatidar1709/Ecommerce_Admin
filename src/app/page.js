"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  if (!session) return <p>Please sign in to view your profile.</p>; // Fallback UI

  const profileImage = session.user.image;

  return (
    <div className="text-blue-300 flex justify-between">
      <h2>Hello, {session.user.name}</h2>
      {session.user.image ? (
        <div className="flex font-bold items-center rounded-full py-1 pl-1 bg-gray-300 text-black gap-">
          <Image
            src={profileImage}
            width={40}
            height={40}
            alt="Profile"
            className="rounded-full" // Optional: add some styling
          />
          <span className="py-1 px-2">{session.user.name}</span>
        </div>
      ) : (
        <p>No profile image available.</p> // Handle case when image URL is not available
      )}
    </div>
  );
}
