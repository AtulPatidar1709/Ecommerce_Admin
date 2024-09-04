"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  async function signout() {
    await signOut({ callbackUrl: "/sign-in" });
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  const user = session.user;

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {user && (
        <div>
          <p>User Email: {user.email}</p>
        </div>
      )}
      <button onClick={signout}>Sign out</button>
    </div>
  );
};

export default Page;
