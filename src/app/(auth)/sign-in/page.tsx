import Link from "next/link";

import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import SocialAuth from "./(components)/social-auth";
import LocalAuth from "./(components)/local-auth";
import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";
import { redirect } from "next/navigation";

const SignInPage = async () => {

   const session = await auth.api.getSession({
      headers: await headers(),
   });

   if(session) return redirect("/");


   return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
         <Card className="w-full max-w-sm rounded-xl">
            <CardHeader className="flex flex-col items-center gap-2">
               <GraduationCap className="mx-auto mb-1 h-10 w-10 text-primary" />
               <CardTitle className="text-xl text-center w-full">
                  Online Learning
               </CardTitle>
               <CardDescription className="text-center w-full">
                  Access your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <LocalAuth />
               <div className="my-6 flex items-center gap-2">
                  <div className="h-px flex-1 bg-muted" />
                  <span className="text-xs text-muted-foreground">
                     or continue with
                  </span>
                  <div className="h-px flex-1 bg-muted" />
               </div>
               <SocialAuth />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
               <p className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                     href="/sign-up"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Sign up
                  </Link>
               </p>
            </CardFooter>
         </Card>
      </div>
   );
};

export default SignInPage;
