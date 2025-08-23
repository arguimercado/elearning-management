"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CourseInfo from "./course-info";
import { Card, CardContent } from "@/components/ui/card";

interface TabViewCourseProps {
   course: CourseModel & {
      user?: { id: string; name?: string | null; email?: string | null };
   }
}

const TabViewCourse = ({ course }: TabViewCourseProps) => {
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
            <Card>
               <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground">Course outline & lessons will appear here (coming soon).</p>
               </CardContent>
            </Card>
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
