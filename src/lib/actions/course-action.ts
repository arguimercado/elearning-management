"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ROUTES } from "@/model/constants/router";
import {
  courseFilterSchema,

  CourseSchema,
  courseSchema
} from "@/model/schemas/course-schema";
import { getCurrentUser } from "../auth/auth-server";
import { Pagination } from "@/model/types/global";
import { handleError } from "../hooks/error";
import {generateSlug} from "../hooks/util";



/**
 * Create a new course
 */
export async function createCourse(data: CourseSchema) {
  try {
    // Get current user
    const user = await getCurrentUser();

    // Validate form data
    const validatedData = courseSchema.parse({
      ...data,
      userId: user.id,
      slug: data.slug || generateSlug(data.title)
    });

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug: validatedData.slug }
    });

    if (existingCourse) {
      throw new Error("A course with this title already exists. Please choose a different title.");
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        slug: validatedData.slug!,
        category: validatedData.category,
        level: validatedData.level,
        duration: validatedData.duration,
        price: validatedData.price,
        status: validatedData.status,
        thumbnail: validatedData.thumbnail || null,
        userId: user.id!,
        createdAt: new Date(),
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
    revalidatePath(ROUTES.DASHBOARD_COURSES);
    revalidatePath(`/admin/courses/${course.slug}`);

    return {
      success: true,
      data: course,
      message: "Course created successfully!"
    };

  } catch (error) {
    handleError(error, "create course");
  }
}

/**
 * Update an existing course
 */
export async function updateCourse(courseId: string, data: Partial<CourseSchema>) {
  try {
    // Get current user
    const user = await getCurrentUser();

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
    revalidatePath(ROUTES.DASHBOARD_COURSES);
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

/**
 * Delete a course
 */
export async function deleteCourse(courseId: string) {
  try {
    // Get current user
    const user = await getCurrentUser();

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
    revalidatePath(ROUTES.DASHBOARD_COURSES);

    return {
      success: true,
      message: "Course deleted successfully!"
    };

  } catch (error) {
    handleError(error, "delete course");
  }
}



/**
 * Get courses with filtering and pagination
 */
export async function getCourses(searchParams?: Record<string, string | string[] | undefined>) {
  try {

     // Parse and validate filter parameters
    const filters = courseFilterSchema.parse({
      search: searchParams?.search || "",
      category: searchParams?.category || "",
      page: searchParams?.page ? Number(searchParams.page) : 1,
      limit: searchParams?.limit ? Number(searchParams.limit) : 10,
      sortOrder: searchParams?.sortOrder || "desc",
    });

    // Get current user
    const user = await getCurrentUser();

   
    const whereClause : any = {
      userId: user.id
    };
    const [courses,totalCount] = await Promise.all([
      prisma.course.findMany({
        where:whereClause
      }),
      prisma.course.count({where: whereClause})
    ]);

        // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / filters.limit);
    const data : Pagination<CourseModel> = {
      totalCount,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
      page: filters.page,
      limit: filters.limit,
      data: courses
    };

    console.log("Courses data:", data);

    return {
      success: true,
      data: data
    };
  } catch (error) {
    handleError(error, "fetch courses");
  }
}

/**
 * Get a single course by ID
 */
export async function getCourseById(courseId: string) {
  try {
    const user = await getCurrentUser();

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
 * Get a single course by slug
 */
export async function getCourseBySlug(slug: string) {
  try {
    const user = await getCurrentUser();

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
    const user = await getCurrentUser();

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

    revalidatePath(ROUTES.DASHBOARD_COURSES);
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
    const user = await getCurrentUser();

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

    revalidatePath(ROUTES.DASHBOARD_COURSES);

    return {
      success: true,
      data: duplicatedCourse,
      message: "Course duplicated successfully!"
    };

  } catch (error) {
    handleError(error, "duplicate course");
  }
}
