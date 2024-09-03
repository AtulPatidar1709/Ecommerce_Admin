"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  async function signout() {
    await signOut({ callbackUrl: "/sign-in" }); // Use callbackUrl to redirect after sign out
  }

  if (status === "loading") {
    // Handle loading state
    return <div>Loading...</div>;
  }

  if (!session) {
    // If user is not authenticated, redirect to the sign-in page
    router.push("/sign-in");
    return null; // Prevent further rendering
  }

  // Fetch user data from session object
  const user = session.user;

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {user && (
        <div>
          <p>User Email: {user.email}</p>
          {/* Add more user details here if needed */}
        </div>
      )}
      <button onClick={signout}>Sign out</button>
    </div>
  );
};

export default Page;
