"use server"
import { courseFilterSchema } from "@/model/schemas/course-schema";
import { getCurrentUser } from "../../admin/user-session";
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";


/**
 * Ge0t published courses with filtering and pagination
 */
export async function getCoursesQuery(searchParams?: Record<string, string | string[] | undefined>)
: Promise<ApiResponse<Pagination<CourseModel>>> {
  try {
     // Parse and validate filter parameters
    const filters = courseFilterSchema.parse({
      search: searchParams?.search || "",
      category: searchParams?.category || "",
      page: searchParams?.page ? Number(searchParams.page) : 1,
      limit: searchParams?.limit ? Number(searchParams.limit) : 10,
      sortOrder: searchParams?.sortOrder || "desc",
    });

    

   
    const whereClause : any = {
      
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
        where:{
          status: "Published",
          ...whereClause
        }
      }),
      prisma.course.count({where: {status: "Published", ...whereClause}})
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
      message: "Courses fetched successfully",
      data: data
    };
  } catch (error) {
    return handleError(error, "fetch courses");
  }
}

