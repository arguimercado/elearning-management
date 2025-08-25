"use server"

import { headers } from "next/headers";
import { auth } from "../../auth";
import { redirect } from "next/navigation";



export async function requireAdminAccess() { 

  const user = await getCurrentUser();

  if (user.role !== "admin") {
    return redirect("/not-admin");
  }

  return user;
}


// Helper function to get current user session
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth/sign-in");
  }


  return session.user;
}
