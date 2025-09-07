/*
   Explore available Courses by the user
   This page displays a list of courses that the user can explore and enroll in.
*/

import PageHeader from "@/components/commons/misc/page-header";
import { getCoursesQuery } from "@/lib/data";
import CourseList from "./_components/course-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const CoursesPage = async () => {

   const data = await getCoursesQuery();

  
   const { data: dataPagination } = data;


   return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
         <PageHeader
            title="Available Courses"
            description="Explore and enroll in courses"
         />
         <CourseList courses={dataPagination?.data || []} isEnrolled={false} />
      </div>
   );
};

export default CoursesPage;
