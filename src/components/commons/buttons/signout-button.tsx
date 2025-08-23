"use client";

import ButtonLoading from "@/components/commons/buttons/button-loading";
import { authClient } from "@/lib/auth/auth-client";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const SignOutButton = () => {
  
  const [signOutTransition,startSignOutTransition] = useTransition();
  const router = useRouter();
  

  async function handleSignOut() {
    startSignOutTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            // Revalidate and refresh the page
            router.refresh();
          },
          onError: (error) => {
            toast.error(`Failed to sign out Error: ${error.error.message}`);
          }
        }
      });
    })
  }
  
  return (
    <ButtonLoading 
      onClick={handleSignOut}
      loading={signOutTransition}
      loadingText="Signing out...">
      Sign Out
    </ButtonLoading>
    
  )
}
export default SignOutButton