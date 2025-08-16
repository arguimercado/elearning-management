"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Github, Globe, Loader } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

const SocialAuth = () => {
   const [githubPending, startGithub] = useTransition();

   async function signInWithGithub() {
      startGithub(async () => {
         await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
            fetchOptions: {
               onSuccess: () => {
                  toast.success("Signed in with GitHub, redirecting...");
               },
               onError: (error) => {
                  toast.error(
                     `Failed to sign in with GitHub: ${error.error.message}`
                  );
               },
            },
         });
      });
   }

   async function signInWithGoogle() {
      await authClient.signIn.social({
         provider: "google",
         callbackURL: "/",
         fetchOptions: {
            onSuccess: () => {
               toast.success("Signed in with Google, redirecting...");
            },
            onError: (error) => {
               toast.error(
                  `Failed to sign in with Google: ${error.error.message}`
               );
            },
         },
      });
   }

   return (
      <div className="flex flex-col gap-2">
         <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full flex items-center gap-2"
            type="button"
         >
            <Globe className="h-5 w-5" />
            Continue with Google
         </Button>
         <Button
            disabled={githubPending}
            onClick={signInWithGithub}
            variant="outline"
            className="w-full flex items-center gap-2"
            type="button"
         >
            {githubPending ? (
               <>
                  <Loader className="size-4 animate-spin" />
                  <span>Loading...</span>
               </>
            ) : (
               <>
                  <Github className="h-5 w-5" />
                  Continue with GitHub
               </>
            )}
         </Button>
      </div>
   );
};
export default SocialAuth;
