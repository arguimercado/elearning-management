"use server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "../../admin/user-session";
import { handleError } from "@/lib/hooks/error";

export async function enrolledCourseCommand(data: { courseId: string }) : Promise<ApiResponse<boolean>> {
   try {
      // Placeholder function for enrolledCourseCommand
      const user = await getCurrentUser();
      console.log(user);
      //check if the user is already enrolled in the course
      const student = await prisma.user.findUnique({
         where: { id: user.id },
         // Replace 'courses' with the actual relation name from your Prisma schema
         include: {
            enrolledCourses: true
         }
      });

      console.log(student);
   
      //if enrolled then return error
      if(student?.enrolledCourses.some(course => course.id === data.courseId)){
         throw new Error("You are already enrolled in this course.");
      }
   
      // Enroll the user in the course
      const enrollCourse = await prisma.enrolledCourse.create({
         data: {
            userId: user.id,
            courseId: data.courseId,
            enrolledAt: new Date(),
            progress: 0,
         }
      });
   
      return {
         success: true,
         data: true,
         message: "Enrolled Successfully"
      };
   }
   catch(error) {
      return handleError(error, "enroll course");
   }
}