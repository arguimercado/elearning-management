"use client";

import ButtonLoading from "@/components/commons/buttons/button-loading";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
   CardFooter,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { enrolledCourseCommand } from "@/lib/data/clients/command/enrolledCourseCommand";

import { DollarSign, ShieldCheck, Layers, Clock, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface ICardProps {
   course: CourseModel;
   enableEnrollButton: boolean;
   userId: string;
}

const PriceCardPart = ({
   course,
   enableEnrollButton,
   userId
}: ICardProps) => {
   const [isPending, startTransition] = useTransition();
   const router = useRouter();

   const showEnrolledButton = () => {
      const currentStudent = course.studentsEnrolled.find(c => c.id === userId)
      console.log(course);
      if (enableEnrollButton) {
         if (!currentStudent) {
            return (
               <ButtonLoading
                  loading={isPending}
                  loadingText="Enrolling..."
                  className="w-full"
                  onClick={() => handleEnroll(course.id)}
               >
                  Enroll Now
               </ButtonLoading>
            );
         }
         else {
            return (
               <>
                  <Button asChild>
                     <Link href="/students">Go to Dashboard</Link>
                  </Button>
               </>
            )
         }
      } else {
         return (
            <p className="text-red-500 dark:text-white bg-accent dark:bg-rose-400 p-4 rounded-full text-center flex items-center gap-2">
               <XIcon className="h-4 w-4 mr-2" />
               <span className="font-medium">
                  You need to log in to enroll in this course.
               </span>
            </p>
         );
      }
   };

   function handleEnroll(courseId: string) {
      startTransition(async () => {
         const response = await enrolledCourseCommand({ courseId });
         if (response?.success) {
            toast.success("Enrolled successfully!");
            router.push("/students/");
         } else {
            toast.error(
               response?.message || "Failed to enroll. Please try again."
            );
         }
      });
   }
   return (
      <div className="lg:col-span-4 lg:pt-2">
         <div className="top-24 lg:sticky space-y-6">
            <Card className="overflow-hidden shadow-sm border-primary/20">
               <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                     <DollarSign className="h-5 w-5 text-primary" />
                     {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                     }).format(course.price)}
                  </CardTitle>
                  <CardDescription>
                     One-time payment. Lifetime access.
                  </CardDescription>
               </CardHeader>
               <CardContent className="pt-0">
                  <ul className="text-xs sm:text-sm space-y-2 mb-6">
                     <li className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />{" "}
                        Access on any device
                     </li>
                     <li className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />{" "}
                        Certificate of completion
                     </li>
                     <li className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />{" "}
                        Future updates included
                     </li>
                  </ul>
                  {showEnrolledButton()}
               </CardContent>
               <CardFooter className="pt-0 text-[11px] text-muted-foreground flex flex-col items-start gap-1">
                  <Separator className="my-2" />
                  <p>30-day refund policy. Secure checkout.</p>
               </CardFooter>
            </Card>

            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                     <Layers className="h-4 w-4" /> At a glance
                  </CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded border bg-muted/40 p-2 flex flex-col gap-1">
                     <span className="text-muted-foreground">Category</span>
                     <span className="font-medium">{course.category}</span>
                  </div>
                  <div className="rounded border bg-muted/40 p-2 flex flex-col gap-1">
                     <span className="text-muted-foreground">Duration</span>
                     <span className="font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                     </span>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};
export default PriceCardPart;
