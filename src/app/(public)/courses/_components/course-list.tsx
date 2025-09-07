"use client";

import CourseCard from "@/components/commons/misc/course-card";
import { ROUTES } from "@/model/constants/router";
import { useRouter } from "next/navigation";

const CourseList = ({ courses, isEnrolled = false }: { courses: CourseModel[], isEnrolled: boolean }) => {
   const router = useRouter();

   const handleMoreClick = (courseId: string) => {
      // Handle the "View More" button click
      router.push(ROUTES.SELECTED_COURSE(courseId));
   };

   if (courses.length === 0) {
      return (
         <p className="text-center text-muted-foreground">
            No courses available.
         </p>
      );
   }

   return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
         {courses.map((course) => (
            <CourseCard
               onMoreClick={handleMoreClick}
               key={course.id}
               course={course}
               showEditButton={false}
               showMoreButton={true}
            />
         ))}
      </div>
   );
};
export default CourseList;
