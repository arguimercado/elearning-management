import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import OtpForm from "./(compontents)/otp-form";


type SearchParams = { [key: string]: string | string[] | undefined };

const VerifyRequest = ({ searchParams }: { searchParams?: SearchParams }) => {
  const rawEmail = searchParams?.email;
  let email = "";
  if (Array.isArray(rawEmail)) {
    email = rawEmail[0] ?? "";
  } else {
    email = rawEmail ?? "";
  }

  // simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmail = email !== "" && !emailRegex.test(email);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm rounded-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <ShieldCheck className="mx-auto mb-1 h-10 w-10 text-primary" />
          <CardTitle className="text-xl text-center w-full">Verify your email</CardTitle>
          <CardDescription className="text-center w-full">Enter the 6-digit code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm  email={email} />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <p className="text-muted-foreground text-center w-full">Didn't receive a code? Check your spam folder or resend.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyRequest;