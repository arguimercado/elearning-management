import { headers } from "next/headers";
import { auth } from "./auth";



// Helper function to get current user session
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Authentication required");
  }

  return session.user;
}
