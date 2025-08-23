

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/commons/page-header";
import StatusCard from "@/components/commons/status-card";
import {
   Plus,
   Eye,
   BookOpen,
   Clock,
   DollarSign,
} from "lucide-react";
import { ROUTES } from "@/model/constants/router";
import { getCourses } from "@/lib/data/course/course-service";
import React from "react";
import { CoursesDataTable } from "./_components/courses-data-table";


// Loading component for Suspense
function CoursesLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}


interface CoursesPageProps {
   search?: string;
   category?: string;
   level?: string;
   status?: string;
   page?: string;
   limit?: string;
}

const CoursesPage = async (props: {searchParams? : Promise<CoursesPageProps>}) => {

   var params = await props.searchParams ?? {};
   // Ensure params is of the correct type for getCourses
   const result = await getCourses(params as Record<string, string | string[] | undefined>);

   const coursesData = result?.data;
   const stats = coursesData
      ? {
           totalCourses: coursesData.totalCount,
           publishedCourses: coursesData.data.filter(
              (c: any) => c.status === "Published"
           ).length,
           draftCourses: coursesData.data.filter(
              (c: any) => c.status === "Draft"
           ).length,
           totalRevenue: coursesData.data
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
               <Link href={ROUTES.DASHBOARD_CREATE}>
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

         {/* Courses Data Table */}
         <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">All Courses</h2>
            <CoursesDataTable data={coursesData?.data || []} />
         </div>
      </div>
   );
};

export default CoursesPage;
