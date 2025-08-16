"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ButtonLoading from "@/components/commons/button-loading";
import { MailIcon } from "lucide-react";

const signInSchema = z.object({
   email: z.email("Enter a valid email"),
});

type SignInValues = z.infer<typeof signInSchema>;

const LocalAuth = () => {
   const router = useRouter();
   const [emailPending, startEmailPending] = useTransition();

   const form = useForm<SignInValues>({
      resolver: zodResolver(signInSchema),
      defaultValues: { email: "" },
      mode: "onSubmit",
   });

   function onSubmit(values: SignInValues) {
      const {email} = values;
      startEmailPending(async () => {
         await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "sign-in",
            fetchOptions: {
               onSuccess: () => {
                  form.reset();
                  toast.success("Verification code sent!");
                  router.push(`/verify-request?email=${email}`);
               },
               onError: () => {
                  toast.error(
                     "Failed to send verification code. Please try again."
                  );
               },
            },
         });
      });
   }

   return (
      <>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="you@example.com"
                              type="email"
                              autoComplete="email"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <ButtonLoading 
                  loading={emailPending}
                  loadingText="Sending..."
                  type="submit" 
                  className="w-full" >
                  <MailIcon className="mr-2 size-4" />
                  <span>
                     Email Sign in
                  </span>
               </ButtonLoading>
            </form>
         </Form>
      </>
   );
};
export default LocalAuth;
