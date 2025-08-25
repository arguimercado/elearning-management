"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CourseInfo from "./course-info";
import { Card, CardContent } from "@/components/ui/card";
import CourseLessonList from "./coure-lesson-list";

interface TabViewCourseProps {
   course: CourseModel;
}

const TabViewCourse = ({ course }: TabViewCourseProps) => {
   console.log(course);
   return (
      <Tabs className="w-full" defaultValue="detail">
         <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="detail">Details</TabsTrigger>
            <TabsTrigger value="lesson">Course Structure</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
         </TabsList>
         <TabsContent value="detail" className="pt-4">
            <CourseInfo course={course} />
         </TabsContent>
         <TabsContent value="lesson" className="pt-4">
            <CourseLessonList courseLessons={course.lessons ?? []} courseId={course.id} />
         </TabsContent>
         <TabsContent value="settings" className="pt-4">
            <Card>
               <CardContent className="py-6 space-y-2">
                  <p className="text-sm text-muted-foreground">Administrative settings & actions (publish, archive, delete) will be managed here.</p>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
   );
};
export default TabViewCourse;
