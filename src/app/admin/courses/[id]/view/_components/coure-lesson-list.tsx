import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/commons/data/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ColumnHelpers } from "@/components/commons/data/columns/column-template";


const { text, badge, date, currency, actions, truncate } = ColumnHelpers;
const columns : ColumnDef<CourseLessonModel>[] = [
   text({
      accessorKey: "title",
      header: "Title",
   }),
   truncate({
      accessorKey: "description",
      header: "Description",
      maxLength: 50,
   }),
   {
   id: "actions",
   header: "Actions",
   cell: ({ row }) => {
      const courseId = row.original.courseId;
      const id = row.original.id;
      return (
         <Button asChild>
            <Link href={`/admin/courses/${courseId}/lesson/${row.original.id}/edit`}>Edit</Link>
         </Button>
      );
   },
},
]

const CourseLessonList = ({courseId, courseLessons} : {courseId: string, courseLessons: CourseLessonModel[]}) => {



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
         <DataTable columns={columns} data={courseLessons} />
      </CardContent>
     </Card>
   );
};
export default CourseLessonList;
