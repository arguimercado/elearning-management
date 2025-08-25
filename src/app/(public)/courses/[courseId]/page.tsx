import { getImageUrl, cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Layers, DollarSign, PlayCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { fetchPreviewCourseQuery } from "@/lib/data";


interface PageProps {
   params: Promise<{ courseId: string }>; // Next.js (app router) async params
}

async function fetchCourse(courseId: string) {
   const res = await fetchPreviewCourseQuery(courseId);
   return res.data || null;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
   const { courseId } = await props.params;
   const course = await fetchCourse(courseId);
   if (!course) return { title: "Course not found" };
   return {
      title: `${course.title} | Course`,
      description: course.description?.slice(0, 150),
      openGraph: {
         title: course.title,
         description: course.description || undefined,
         images: course.thumbnail ? [{ url: getImageUrl(course.thumbnail) }] : undefined
      }
   };
}

const levelColors: Record<string, string> = {
   BEGINNER: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
   INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
   ADVANCED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

const  CoursePage = async (props: PageProps) => {
   
   const { courseId } = await props.params;
   const course = await fetchCourse(courseId);

   if (!course) {
      return (
         <div className="container py-24 text-center">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Course not found</h1>
            <p className="text-muted-foreground">The course you're looking for doesn't exist or is unavailable.</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col">
         {/* Hero */}
         <section className="relative w-full">
            <div className="relative aspect-[21/8] w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-900 dark:to-slate-800">
               {course.thumbnail ? (
                  <Image
                     src={getImageUrl(course.thumbnail)}
                     alt={course.title}
                     fill
                     priority
                     sizes="100vw"
                     className="object-cover"
                  />
               ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-200 text-5xl font-black opacity-10 select-none">
                     {course.title.slice(0, 1)}
                  </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/10" />
               <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-6xl px-6 pb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                     <Badge variant="outline" className="backdrop-blur bg-background/70 border-border/50">{course.category}</Badge>
                     <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</Badge>
                     <Badge variant="outline" className={cn("text-xs", levelColors[course.level] || "")}>{course.level}</Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight max-w-3xl">{course.title}</h1>
                  
               </div>
            </div>
         </section>
         {/* Main Content */}
         <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 py-10">
            {/* Left: Description & Outline */}
            <div className="lg:col-span-8 space-y-10">
               {/* Full Description */}
               {course.description && (
                  <Card className="border-muted/60">
                     <CardHeader>
                        <CardTitle className="text-lg">About this course</CardTitle>
                        
                     </CardHeader>
                     <CardContent>
                        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
                     </CardContent>
                  </Card>
               )}

               {/* Curriculum */}
                     {course.courseLessons && course.courseLessons.length > 0 && (
                  <Card className="border-muted/60">
                     <CardHeader>
                        <CardTitle className="text-lg">Course Outline</CardTitle>
                              <CardDescription>{course.courseLessons.length} lesson{course.courseLessons.length > 1 ? 's' : ''}</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        <ol className="space-y-3 counter-reset list-decimal">
                                 {course.courseLessons.map((l: any, idx: number) => (
                              <li key={l.id} className="flex gap-3 rounded-md border bg-muted/30 p-3 text-sm items-start">
                                 <div className="mt-0.5 text-muted-foreground font-medium">{idx + 1}.</div>
                                 <div className="flex-1 space-y-1">
                                    <div className="font-medium leading-snug flex items-center gap-2">
                                       <PlayCircle className="h-4 w-4 text-primary/70" />
                                       {l.title}
                                    </div>
                                    {l.description && <p className="text-xs text-muted-foreground line-clamp-2" title={l.description}>{l.description}</p>}
                                 </div>
                              </li>
                           ))}
                        </ol>
                     </CardContent>
                  </Card>
               )}
            </div>

            {/* Right: Price Card */}
            <div className="lg:col-span-4 lg:pt-2">
               <div className="top-24 lg:sticky space-y-6">
                  <Card className="overflow-hidden shadow-sm border-primary/20">
                     <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center gap-2">
                           <DollarSign className="h-5 w-5 text-primary" />
                           {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(course.price)}
                        </CardTitle>
                        <CardDescription>One-time payment. Lifetime access.</CardDescription>
                     </CardHeader>
                     <CardContent className="pt-0">
                        <ul className="text-xs sm:text-sm space-y-2 mb-6">
                           <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0" /> Access on any device</li>
                           <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0" /> Certificate of completion</li>
                           <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-primary shrink-0" /> Future updates included</li>
                        </ul>
                        <Button size="lg" className="w-full">Enroll Now</Button>
                        <Button variant="outline" size="sm" className="w-full mt-2">Add to Wishlist</Button>
                     </CardContent>
                     <CardFooter className="pt-0 text-[11px] text-muted-foreground flex flex-col items-start gap-1">
                        <Separator className="my-2" />
                        <p>30-day refund policy. Secure checkout.</p>
                     </CardFooter>
                  </Card>

                  <Card>
                     <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4" /> At a glance</CardTitle>
                     </CardHeader>
                     <CardContent className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded border bg-muted/40 p-2 flex flex-col gap-1"><span className="text-muted-foreground">Category</span><span className="font-medium">{course.category}</span></div>
                        <div className="rounded border bg-muted/40 p-2 flex flex-col gap-1"><span className="text-muted-foreground">Duration</span><span className="font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span></div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}

export default CoursePage;