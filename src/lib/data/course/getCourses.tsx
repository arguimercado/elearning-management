"use server"
import { courseFilterSchema } from "@/model/schemas/course-schema";
import { getCurrentUser } from "../admin/user-session";
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";
import { Pagination } from "@/model/types/global";

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


    //implement filters
    if (filters.search) {
      whereClause.title = {
        contains: filters.search,
        mode: "insensitive"
      };
    }

    if (filters.category) {
      whereClause.category = {
        equals: filters.category
      };
    }

    

    const [courses,totalCount] = await Promise.all([
      prisma.course.findMany({
        where:whereClause
      }),
      prisma.course.count({where: whereClause})
    ]);



        // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / filters.limit);
    const data : Pagination<CourseModel> ={
      totalCount,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
      page: filters.page,
      limit: filters.limit,
      data: courses
    };

    

    return {
      success: true,
      data: data
    };
  } catch (error) {
    handleError(error, "fetch courses");
  }
}

