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

const signInSchema = z.object({
   email: z.email("Enter a valid email"),
});

type SignInValues = z.infer<typeof signInSchema>;

const LocalAuth = () => {

   const [emailTransition, startEmailTransition] = useTransition();
   
   const form = useForm<SignInValues>({
      resolver: zodResolver(signInSchema),
      defaultValues: { email: "" },
      mode: "onSubmit",
   });

   function onSubmit(values: SignInValues) {
      startEmailTransition(async () => {
         await authClient.emailOtp.sendVerificationOtp({
            email: values.email,
            type: "sign-in",
            fetchOptions: {
               onSuccess: () => {
                  form.reset();
                  toast.success("Verification code sent!");
               }
            }
         });
      })
    
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
               <Button type="submit" className="w-full">
                  Email Sign in
               </Button>
            </form>
         </Form>
      </>
   );
};
export default LocalAuth;
