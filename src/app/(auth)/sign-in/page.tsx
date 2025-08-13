"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { GraduationCap, Github, Globe } from "lucide-react"

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  })

  const onSubmit = (values: SignInValues) => {
    // TODO: replace with real auth call
    console.log("Sign in", values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm rounded-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <GraduationCap className="mx-auto mb-1 h-10 w-10 text-primary" />
          <CardTitle className="text-xl text-center w-full">Online Learning</CardTitle>
          <CardDescription className="text-center w-full">Access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
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
                      <Input placeholder="••••••••" type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Sign in</Button>
            </form>
          </Form>
          <div className="my-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-muted" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full flex items-center gap-2" type="button">
              <Globe className="h-5 w-5" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2" type="button">
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account? {" "}
            <Link href="/sign-up" className="underline underline-offset-4 hover:text-primary">Sign up</Link>
          </p>
          <Button variant="ghost" size="sm" type="button" className="w-full" disabled={form.formState.isSubmitting}>
            Forgot password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}