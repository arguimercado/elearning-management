"use server"
import { handleError } from "@/lib/hooks/error";
import { ROUTES } from "@/model/constants/router";
import { CourseSchema, courseSchema } from "@/model/schemas/course-schema";
import { revalidatePath } from "next/cache";


import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { requireAdminAccess } from "@/lib/data";

/**
 * Create a new course
 */
export async function createCourseCommand(data: CourseSchema) : Promise<ApiResponse<CourseModel>> {
  
  try {
    // Get current user
    const user = await requireAdminAccess();

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
    revalidatePath(ROUTES.COURSE_LIST);
    revalidatePath(`/admin/courses/${course.slug}`);

    return {
      success: true,
      data: {
        id: course.id,
        title: course.title,
        description: course.description,
        slug: course.slug,
        category: course.category,
        level: course.level,
        duration: course.duration,
        price: course.price,
        status: course.status,
        thumbnail: course.thumbnail,
      },
      message: "Course created successfully!"
    };

  } 
  catch (error) {
    return handleError(error, "create course");
  }
}