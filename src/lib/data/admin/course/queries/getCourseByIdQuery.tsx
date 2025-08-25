"use server"
import { handleError } from "@/lib/hooks/error";
import { requireAdminAccess } from "../../user-session";
import { prisma } from "@/lib/db";

/**
 * Get a single course by ID createdAt: Date;
  updatedAt: Date;
 */
export async function getCourseByIdQuery(courseId: string) : Promise<ApiResponse<CourseModel>> {
  try {

    const user = await requireAdminAccess();

    //include the lesson
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: user.id // Only get user's own courses
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lessons: {
          select: {
            id: true,
            title: true,
            chapter: true,
            description: true,
            contentUrl: true,
            courseId: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

   

    if (!course) {
       throw new Error("Course not found");
    }

    return {
      success: true,
      data: {...course, lessons: course.lessons.map(lesson => ({...lesson}))},
      message: "Course fetched successfully",
    };

  } 
  catch (error) {
    return handleError(error, "fetch course");
  }
}

export type GetCourseResponse = Awaited<ReturnType<typeof getCourseByIdQuery>>;