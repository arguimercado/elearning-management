import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getImageUrl } from "@/lib/utils";
import { Clock, DollarSign, MoreVertical } from "lucide-react";
import Image from "next/image";


interface IProps {
   course: CourseModel;
   showEditButton: boolean;
   showMoreButton: boolean;
   onEditClick?: (courseId: string,action: string) => void;
   onMoreClick?: (courseId: string) => void;
}

const CourseCard = ({ course, showEditButton, showMoreButton, onEditClick, onMoreClick }: IProps) => {
   return (
      <Card className="h-full transition-shadow group-hover:shadow-md p-0 relative">
         {showEditButton && (
            <div className="absolute top-2 right-2 z-10">
               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Button variant="outline" className="h-8 px-2">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuItem>
                        Edit
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         )}
         <CardHeader className="m-0 p-0">
            {course.thumbnail &&(
               <Image
                  src={getImageUrl(course.thumbnail)}
                  alt={course.title}
                  width={300}
                  height={200}
                  className="rounded-md object-cover w-full "
               />
            )}
             <span className="w-full text-sm px-2 py-0.5 font-medium tracking-wide">
                  {course.category}
               </span>
         </CardHeader>
         <CardContent className="flex flex-col gap-4 py-2 ">
            <div className="flex items-start justify-between gap-2">
               <CardTitle className="line-clamp-2 text-sm font-semibold leading-snug">
                  {course.title}
               </CardTitle>
               <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] font-medium"
               >
                  {course.level}
               </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground ">
               <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{course.duration}</span>
               </div>
               <div className="flex items-center gap-1 font-medium text-foreground">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>
                     {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                     }).format(course.price)}
                  </span>
               </div>
            </div>
         </CardContent>
         <CardFooter className="py-2">
             {showMoreButton && (
               <Button onClick={() => onMoreClick?.(course.id)}  className="mt-2 w-full">
                  View More
               </Button>
            )}
         </CardFooter>
      </Card>
   );
};
export default CourseCard;
