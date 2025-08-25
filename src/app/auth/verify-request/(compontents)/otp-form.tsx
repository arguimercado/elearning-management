"use client";
import * as React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { OTPInput, type RenderProps, type SlotProps } from "input-otp";
import { otpSchema, OtpValues } from "@/model/schemas/auth-schema";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ButtonLoading from "@/components/commons/buttons/button-loading";

const OtpForm: React.FC<{ email:string}> = ({
   email,
}) => {
   const router = useRouter();
	const [otpPending, startTransition] = React.useTransition();

   const form = useForm<OtpValues>({
      resolver: zodResolver(otpSchema),
      defaultValues: { code: "" },
   });

   const handleSubmit = (values: OtpValues) => {
      const {code} = values;

		startTransition(async () => {
			await authClient.signIn.emailOtp({
				email: email,
            otp: code,
            fetchOptions: {
               onSuccess: () => {
                  form.reset();
                  toast.success("Email verified successfully");
                  router.push("/");
               },
               onError: (error) => {
                  toast.error("Invalid OTP");
               }
            }
			})
		});
      
   };

   return (
      <form
         onSubmit={form.handleSubmit(handleSubmit)}
         className="space-y-6 w-full max-w-xs mx-auto"
      >
         <div>
            <label
               htmlFor="otp"
               className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
               Enter verification code
            </label>
            <OTPInput
               maxLength={6}
               value={form.watch("code")}
               onChange={(val: string) => form.setValue("code", val)}
               render={({ slots }: RenderProps) => (
                  <div className="flex gap-2 justify-center">
                     {slots.map((slot: SlotProps, idx: number) => (
                        <input
                           key={idx}
                           value={slot.char ?? ""}
                           readOnly
                           className={
                              "w-10 h-12 text-2xl border rounded-md text-center bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary outline-none transition-all" +
                              (slot.isActive
                                 ? " ring-2 ring-primary border-primary"
                                 : "")
                           }
                           placeholder={slot.placeholderChar ?? ""}
                           tabIndex={-1}
                        />
                     ))}
                  </div>
               )}
            />
            {form.formState.errors.code && (
               <p className="mt-2 text-sm text-red-600">
                  {form.formState.errors.code.message}
               </p>
            )}
         </div>
         <ButtonLoading
            loadingText="Verifying..."
            loading={otpPending}
            type="submit"
            className="w-full">
            Verify
         </ButtonLoading>
      </form>
   );
};

export default OtpForm;
