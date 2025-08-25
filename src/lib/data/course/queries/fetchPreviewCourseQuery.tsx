"use server"
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";

/**
 * Preview a course by ID (no auth required)
 */
export async function fetchPreviewCourseQuery(courseId: string) {
   
   try {

      const course = await prisma.course.findFirst({
         where: {
            id: courseId,
            status: "Published"
         },
         include: {
            lessons: {
               select: {
                  id: true,
                  title: true,
                  chapter: true,
                  description: true,
                  contentUrl: true
               },
               orderBy: { chapter: 'asc' }
            }
         }
      });
   
      if (!course) {
         throw new Error("Course not found");
      }
   
      // Align with CourseModel property 'courseLessons'
      const mapped = { ...course, courseLessons: course.lessons } as unknown as CourseModel;
      return {
         success: true,
         message: "Course fetched successfully",
         data: mapped
      }
   }catch(error) {
      return handleError(error, "fetch course");
   }
}