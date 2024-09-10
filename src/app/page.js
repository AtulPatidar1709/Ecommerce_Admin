'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

const dummyImage = '/assets/images/dummyprofile.png';

export default function Home() {
  const { data: session } = useSession();

  // Fallback UI if the user is not signed in
  if (!session)
    return (
      <p className="text-center text-red-500">
        Please sign in to view your profile.
      </p>
    );

  const profileImage = session.user.image || dummyImage;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl text-blue-500 font-bold">
        Hello, {session.user.name}
      </h2>

      {/* Profile Section */}
      {profileImage ? (
        <div className="flex items-center rounded-full bg-gray-300 p-1 text-black gap-2">
          <Image
            src={profileImage}
            width={40}
            height={40}
            alt="Profile"
            className="rounded-full"
          />
          <span className="font-semibold px-2">{session.user.name}</span>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No profile image available.</p>
      )}
    </div>
  );
}
