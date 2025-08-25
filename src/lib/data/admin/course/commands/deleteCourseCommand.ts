"use server"
import { requireAdminAccess } from "@/lib/data";
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";
import { ROUTES } from "@/model/constants/router";
import { revalidatePath } from "next/cache";



/**
 * Delete a course
 */
export async function deleteCourseCommand(courseId: string) : Promise<ApiResponse<null>> {
  try {
    // Get current user
    const user = await requireAdminAccess();

    // Get existing course and verify ownership
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!existingCourse) {
      throw new Error("Course not found");
    }

    if (existingCourse.userId !== user.id) {
      throw new Error("You don't have permission to delete this course");
    }

    // Delete the course
    await prisma.course.delete({
      where: { id: courseId }
    });

    // Revalidate relevant pages
    revalidatePath(ROUTES.COURSE_LIST);

    return {
      success: true,
      data: null,
      message: "Course deleted successfully!"
    };

  } catch (error) {
    return handleError(error, "delete course");
  }
}

