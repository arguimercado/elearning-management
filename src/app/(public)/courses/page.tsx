/*
   Explore available Courses by the user
   This page displays a list of courses that the user can explore and enroll in.
*/

import PageHeader from "@/components/commons/misc/page-header";
import { getCoursesQuery } from "@/lib/data";
import CourseList from "./_components/course-list";

const CoursesPage = async () => {
   
   const data = await getCoursesQuery();
   const course = {
      courses: data.data?.data || [],
      page: data.data?.page || 1,
      hasNext: data.data?.hasNextPage || false,
      hasPrevious: data.data?.hasPreviousPage || false,
      limit: data.data?.limit || 10,
      totalCount: data.data?.totalCount || 0,
   }

  

   return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
         <PageHeader
            title="Available Courses"
            description="Explore and enroll in courses"
         />
         <CourseList data={course.courses} />
      </div>
   );
};

export default CoursesPage;
