"use server"

import { prisma } from "@/lib/db";
import { getUserSession } from "../../admin/user-session";
import { handleError } from "@/lib/hooks/error";


export async function getMyCourseQuery():
   Promise<ApiResponse<CourseModel[]>> {

   try {
      const session = await getUserSession();

      // get courses id for the current user
      const enrolledCourses = await prisma.enrolledCourse.findMany({
         where: {
            userId: session?.user.id
         },
         select: { courseId: true }
      });

      const courseIds = enrolledCourses.map(ec => ec.courseId);

      if (courseIds.length === 0) {
         throw new Error("no course enrolled");
      }

      // get courses and enrollment counts
      const courses = await prisma.course.findMany({
         where: {
            id: {
               in: courseIds
            }
         },
         orderBy: {
            id: "asc"
         }
      });
      
      const coursesDto: CourseModel[] = courses.map(c => ({
         ...c,
         studentsEnrolled: []
      }));


      return {
         success: true,
         data: coursesDto,
         message: "Enrolled course successful"
      };

   } catch (error) {
      return handleError(error, "getCourseQuery");
   }

}