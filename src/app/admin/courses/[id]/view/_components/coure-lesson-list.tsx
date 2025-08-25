import PageHeader from "@/components/commons/misc/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const CourseLessonList = ({courseId} : {courseId: string}) => {
   return (
     <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
         <div className="flex flex-col">
            <h2 className="text-lg font-medium">Lessons</h2>
            <p className="text-sm text-muted-foreground">
               Manage the lessons for this course
            </p>
         </div>
         <Button asChild>
            <Link href={`/admin/courses/${courseId}/lesson/create`}>Create Lesson</Link>
         </Button>
      </CardHeader>
      <CardContent>

      </CardContent>
     </Card>
   );
};
export default CourseLessonList;
