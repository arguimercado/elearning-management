import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, DollarSign, CalendarDays, Layers, Hash } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CourseInfoProps {
   course: CourseModel & {
      user?: { id: string; name?: string | null; email?: string | null };
   }
}

const levelColors: Record<string, string> = {
   BEGINNER: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
   INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
   ADVANCED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
}

const statusColors: Record<string, string> = {
   Draft: "bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300",
   Published: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
   Archive: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
}

const MetaItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) => (
   <div className="flex flex-col gap-1 rounded-md border bg-muted/40 p-3 text-xs sm:text-sm">
      <div className="flex items-center gap-1.5 font-medium text-muted-foreground"><Icon className="h-3.5 w-3.5"/> {label}</div>
      <div className="font-semibold text-foreground break-words">{value}</div>
   </div>
)

const CourseInfo = ({ course }: CourseInfoProps) => {
   return (
      <div className="space-y-6">
         <Card className="overflow-hidden">
            {course.thumbnail && (
               <div className="relative aspect-[16/6] w-full bg-muted">
                  <Image
                     src={getImageUrl(course.thumbnail)}
                     alt={course.title}
                     fill
                     priority
                     sizes="100vw"
                     className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-background/0 px-6 py-4 flex flex-wrap items-end gap-3">
                     <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{course.title}</h2>
                     <Badge variant="outline" className={cn("text-xs", levelColors[course.level])}>{course.level}</Badge>
                     <Badge className={cn("text-xs", statusColors[course.status])}>{course.status}</Badge>
                  </div>
               </div>
            )}
            <CardHeader className={!course.thumbnail ? "pb-2" : "pt-6"}>
               {!course.thumbnail && (
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
               )}
                     {course.description && (
                        <CardDescription>
                           <div
                              className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
                              // NOTE: description already controlled via editor; sanitizer could be added if needed
                              dangerouslySetInnerHTML={{ __html: course.description || "" }}
                           />
                        </CardDescription>
                     )}
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetaItem icon={Hash} label="Slug" value={<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{course.slug}</code>} />
                  <MetaItem icon={Layers} label="Category" value={course.category} />
                  <MetaItem icon={Clock} label="Duration" value={course.duration} />
                  <MetaItem icon={DollarSign} label="Price" value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(course.price)} />
                  <MetaItem icon={CalendarDays} label="Created" value={new Date(course.createdAt).toLocaleDateString()} />
                  <MetaItem icon={CalendarDays} label="Last Updated" value={new Date(course.updatedAt).toLocaleDateString()} />
               </div>

               <Separator />

               <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Instructor</h3>
                  <div className="rounded-md border p-3 bg-muted/30 text-sm">
                     <p className="font-medium">{course.user?.name || "Unknown"}</p>
                     {course.user?.email && <p className="text-muted-foreground text-xs">{course.user.email}</p>}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}

export default CourseInfo;
