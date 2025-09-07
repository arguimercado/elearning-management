"use server"
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";

/**
 * Preview a course by ID (no auth required)
 */
export async function fetchPreviewCourseQuery(courseId: string) : Promise<ApiResponse<CourseModel | null>> {
   
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
            },
            enrolledStudents: true
         }
      });
   
      if (!course) {
         throw new Error("Course not found");
      }

      const studentsEnrolled = await prisma.user.findMany({
         where: {
            enrolledCourses: {
               some: {
                  courseId: course.id
               }
            }
         }
      });



      // Align with CourseModel property 'lessons'
      const mapped : CourseModel = { 
            ...course, 
            lessons: course.lessons.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                chapter: lesson.chapter,
                contentUrl: lesson.contentUrl,
                duration: (lesson as any).duration ?? null,
                courseId: course.id,
                createdAt: (lesson as any).createdAt ?? null,
                updatedAt: (lesson as any).updatedAt ?? null
            })),
            studentsEnrolled: studentsEnrolled.map(student => ({
                ...student,
                role: student.role ?? ""
            }))
        };
      return {
         success: true,
         message: "Course fetched successfully",
         data: mapped
      }
   }catch(error) {
      return handleError(error, "fetch course");
   }
}