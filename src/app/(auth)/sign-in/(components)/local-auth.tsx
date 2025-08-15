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

const signInSchema = z.object({
   email: z.email("Enter a valid email"),
   password: z.string().min(6, "Min 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

const LocalAuth = () => {
   const form = useForm<SignInValues>({
      resolver: zodResolver(signInSchema),
      defaultValues: { email: "", password: "" },
      mode: "onSubmit",
   });

   function onSubmit(values: SignInValues) {
      // TODO: replace with real auth call
      console.log("Sign in", values);
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
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="••••••••"
                              type="password"
                              autoComplete="current-password"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="w-full">
                  Sign in
               </Button>
            </form>
         </Form>
      </>
   );
};
export default LocalAuth;
