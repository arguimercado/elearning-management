"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ROUTES } from "@/model/constants/router";
import {requireAdminAccess } from "../admin/user-session";
import { handleError } from "../../hooks/error";
import {generateSlug} from "../../hooks/util";




/**
 * Get a single course by slug
 */
export async function getCourseBySlug(slug: string) {
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
      data: course
    };

  } catch (error) {
    handleError(error, "fetch course");
  }
}

/**
 * Toggle course status (Draft <-> Published)
 */
export async function toggleCourseStatus(courseId: string) {
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
    revalidatePath(`/admin/courses/${updatedCourse.slug}`);

    return {
      success: true,
      data: updatedCourse,
      message: `Course ${newStatus.toLowerCase()} successfully!`
    };

  } catch (error) {
    handleError(error, "toggle course status");
  }
}

/**
 * Duplicate a course
 */
export async function duplicateCourse(courseId: string) {
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

    // Create a new title and slug for the duplicate
    const newTitle = `${existingCourse.title} (Copy)`;
    const newSlug = generateSlug(newTitle);

    // Ensure unique slug
    let finalSlug = newSlug;
    let counter = 1;
    while (await prisma.course.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${newSlug}-${counter}`;
      counter++;
    }

    const duplicatedCourse = await prisma.course.create({
      data: {
        title: newTitle,
        description: existingCourse.description,
        slug: finalSlug,
        category: existingCourse.category,
        level: existingCourse.level,
        duration: existingCourse.duration,
        price: existingCourse.price,
        status: "Draft", // Always create duplicates as draft
        thumbnail: existingCourse.thumbnail,
        userId: user.id
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

    revalidatePath(ROUTES.COURSE_LIST);

    return {
      success: true,
      data: duplicatedCourse,
      message: "Course duplicated successfully!"
    };

  } catch (error) {
    handleError(error, "duplicate course");
  }
}
