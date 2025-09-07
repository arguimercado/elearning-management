"use server";

import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";

export async function getStudentQuery(studentId: string): Promise<ApiResponse<StudentModel | null>> {
   
   try {
      const student = await prisma.user.findUnique({
         where: { id: studentId },
         include: {
            enrolledCourses: {
               include: {
                  course: true
               }
            }
         }
      });

      return {
         success: true,
         message: "Student data fetched successfully.",
         data: {
            id: student?.id || "",
            name: student?.name || "",
            email: student?.email || "",
            role: student?.role || "",
            enrolledCourses: student?.enrolledCourses?.map(ec => ec.course) || []
         }
      };

   } catch (error) {
      return handleError(error, "Failed to fetch student data.");
   }
}