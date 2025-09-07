import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface IProps {
	course : CourseModel
	levelColors: Record<string, string>;
}

const HeroComponentPart = ({course, levelColors}: IProps) => {

   return (
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
                  <Badge
                     variant="outline"
                     className="backdrop-blur bg-background/70 border-border/50"
                  >
                     {course.category}
                  </Badge>
                  <Badge
                     variant="secondary"
                     className="flex items-center gap-1"
                  >
                     <Clock className="h-3.5 w-3.5" />
                     {course.duration}
                  </Badge>
                  <Badge
                     variant="outline"
                     className={cn("text-xs", levelColors[course.level ?? ""] || "")}
                  >
                     {course.level}
                  </Badge>
               </div>
               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight max-w-3xl">
                  {course.title}
               </h1>
            </div>
         </div>
      </section>
   );
};
export default HeroComponentPart;
