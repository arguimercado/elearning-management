"use server"
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";

// Public query: fetch a published course by id (no auth required)
export async function getPublicCourseByIdQuery(courseId: string): Promise<ApiResponse<CourseModel>> {
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
  } catch (error) {
    return handleError(error, "fetch course");
  }
}

export type GetPublicCourseResponse = Awaited<ReturnType<typeof getPublicCourseByIdQuery>>;