"use server"
import { handleError } from "@/lib/hooks/error";
import { requireAdminAccess } from "../admin/user-session";
import { prisma } from "@/lib/db";
import { success } from "zod";
import { CourseSchema } from "@/model/schemas/course-schema";

/**
 * Get a single course by ID
 */
export async function getCourseById(courseId: string) {
  try {
    const user = await requireAdminAccess();

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
        }
      }
    });

    if (!course) {
       return {
        success: false,
        data: null,
       }
    }

    return {
      success: true,
      data: course
    };

  } 
  catch (error) {
    handleError(error, "fetch course");
  }
}

export type GetCourseResponse = Awaited<ReturnType<typeof getCourseById>>;