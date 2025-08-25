"use server"
import { courseFilterSchema } from "@/model/schemas/course-schema";
import { requireAdminAccess } from "../../user-session";
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";


async function getCourseByAuthorQuery(searchParams?: Record<string, string | string[] | undefined>): Promise<ApiResponse<Pagination<CourseModel>>> {
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
      const author = await requireAdminAccess();


      const whereClause: any = {
         userId: author.id
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

      const [courses, totalCount] = await Promise.all([
         prisma.course.findMany({
            where: whereClause
         }),
         prisma.course.count({ where: whereClause })
      ]);

          // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / filters.limit);
    const data = {
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



   }
   catch(error) {
      return handleError(error,"Get Course By Author");
   }
}
