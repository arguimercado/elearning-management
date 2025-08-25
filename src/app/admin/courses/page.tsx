//@typescript-eslint/no-explicit-any
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/misc/page-header";
import StatusCard from "@/components/commons/misc/status-card";
import { Plus, Eye, BookOpen, Clock, DollarSign } from "lucide-react";
import { ROUTES } from "@/model/constants/router";

import React from "react";
import CoursesTabs from "./_components/courses-tab";
import { getCoursesQuery } from "@/lib/data";

interface CoursesPageProps {
   search?: string;
   category?: string;
   level?: string;
   status?: string;
   page?: string;
   limit?: string;
}


const CoursesPage = async (props: {searchParams?: Promise<CoursesPageProps>;}) => {
   
   var params = (await props.searchParams) ?? {};
   // Ensure params is of the correct type for getCourses
   const result = await getCoursesQuery(
      params as Record<string, string | string[] | undefined>
   );

   if (!result.success) {
      return <div>Error loading courses data</div>;
   }

   const stats = result.data
      ? {
           totalCourses: result.data.totalCount,
           publishedCourses: result.data.data.filter(
              (c: any) => c.status === "Published"
           ).length,
           draftCourses: result.data.data.filter(
              (c: any) => c.status === "Draft"
           ).length,
           totalRevenue: result.data.data
              .filter((c: any) => c.status === "Published")
              .reduce((sum: number, course: any) => sum + course.price, 0),
        }
      : {
           totalCourses: 0,
           publishedCourses: 0,
           draftCourses: 0,
           totalRevenue: 0,
        };

  

   return (
      <div className="space-y-6">
         {/* Header Section */}
         <PageHeader
            title="Courses"
            description="Manage your courses and track their performance"
         >
            <Button className="w-full sm:w-auto" asChild>
               <Link href={ROUTES.COURSE_CREATE}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
               </Link>
            </Button>
         </PageHeader>

         {/* Stats Cards */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatusCard
               title="Total Courses"
               value={stats.totalCourses}
               icon={BookOpen}
            />
            <StatusCard
               title="Published"
               value={stats.publishedCourses}
               icon={Eye}
            />
            <StatusCard
               title="Drafts"
               value={stats.draftCourses.toString()}
               description="Courses in development"
               icon={Clock}
            />
            <StatusCard
               title="Total Revenue"
               value={`$${stats.totalRevenue.toFixed(2)}`}
               description="From published courses"
               icon={DollarSign}
            />
         </div>
         <CoursesTabs coursesData={coursesData?.data || []} />
      </div>
   );
};

export default CoursesPage;
