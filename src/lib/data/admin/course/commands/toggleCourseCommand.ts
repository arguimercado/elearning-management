"use server"
import { prisma } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/hooks/error";
import { ROUTES } from "@/model/constants/router";
import { requireAdminAccess } from "@/lib/data";


/**
 * Toggle course status (Draft <-> Published)
 */
export async function toggleCourseStatusCommand(courseId: string) : Promise<ApiResponse<CourseModel>> {
  
   try {
    const user = await requireAdminAccess();

    const existingCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: user.id
      }
    });

    if (!existingCourse) {
      throw new Error("Course not found");
    }

    const newStatus = existingCourse.status === "Published" ? "Draft" : "Published";

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { status: newStatus },
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

    revalidatePath(ROUTES.COURSE_LIST);
    

    return {
      success: true,
      data: updatedCourse,
      message: `Course ${newStatus.toLowerCase()} successfully!`
    };

  } catch (error) {
    return handleError(error, "toggle course status");
  }
}