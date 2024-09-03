"use client";

const { useSession, SessionProvider } = require("next-auth/react");

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
