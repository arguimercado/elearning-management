"use server"
import { handleError } from "@/lib/hooks/error";
import { ROUTES } from "@/model/constants/router";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "../admin/user-session";
import { prisma } from "@/lib/db";
import { courseSchema, CourseSchema } from "@/model/schemas/course-schema";
import { generateSlug } from "@/lib/hooks/util";




/**
 * Update an existing course
 */
export async function updateCourse(courseId: string, data: Omit<CourseSchema, "id">) {
  try {
    // Get current user
    const user = await requireAdminAccess();

    // Validate the course ID and get existing course
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!existingCourse) {
      throw new Error("Course not found");
    }

    // Check if user owns the course
    if (existingCourse.userId !== user.id) {
      throw new Error("You don't have permission to update this course");
    }

    // Prepare update data
    const updateData: any = { ...data };

    // Generate new slug if title is being updated
    if (data.title && data.title !== existingCourse.title) {
      updateData.slug = generateSlug(data.title);

      // Check if new slug already exists (excluding current course)
      const existingSlug = await prisma.course.findFirst({
        where: {
          slug: updateData.slug,
          id: { not: courseId }
        }
      });

      if (existingSlug) {
        throw new Error("A course with this title already exists. Please choose a different title.");
      }
    }

    // Validate update data
    const validatedData = courseSchema.parse({
      id: courseId,
      ...updateData
    });

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        slug: validatedData.slug,
        category: validatedData.category,
        level: validatedData.level,
        duration: validatedData.duration,
        price: validatedData.price,
        status: validatedData.status,
        thumbnail: validatedData.thumbnail,
        updatedAt: new Date(),
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

    // Revalidate relevant pages
    revalidatePath(ROUTES.COURSE_LIST);
    revalidatePath(`/admin/courses/${updatedCourse.slug}`);

    // If slug changed, revalidate old slug path too
    if (existingCourse.slug !== updatedCourse.slug) {
      revalidatePath(`/admin/courses/${existingCourse.slug}`);
    }

    return {
      success: true,
      data: updatedCourse,
      message: "Course updated successfully!"
    };

  } catch (error) {
    handleError(error, "update course");
  }
}