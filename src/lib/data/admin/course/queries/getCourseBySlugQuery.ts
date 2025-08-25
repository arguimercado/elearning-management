"use server"
import { prisma } from "@/lib/db";
import { requireAdminAccess } from "../../user-session";
import { handleError } from "@/lib/hooks/error";

/**
 * Get a single course by slug
 */
export async function getCourseBySlugQuery(slug: string) : Promise<ApiResponse<CourseModel>> {
  try {
    const user = await requireAdminAccess();

    const course = await prisma.course.findFirst({
      where: {
        slug,
        userId: user.id // Only get user's own courses
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return {
      success: true,
      message: "Course fetched successfully",
      data: course
    };

  } 
  catch (error) {
    return handleError(error, "fetch course");
  }
}
