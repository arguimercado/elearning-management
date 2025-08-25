"use server"
import { prisma } from "@/lib/db";
import { handleError } from "@/lib/hooks/error";
import { ROUTES } from "@/model/constants/router";
import { lessonSchema, LessonSchema } from "@/model/schemas/course-schema";
import { revalidatePath } from "next/cache";

/**
 * Create a new lesson
 * @param data - Lesson data
 * @returns ApiResponse or ApiErrorResponse
 */
export async function createCourseLessonCommand(data: LessonSchema) : Promise<ApiResponse<LessonSchema>> {
   try {
      //validate and sanitize 
      const validatedLesson = lessonSchema.parse(data);

      const lesson = await prisma.lesson.create({
         data: {
            title: validatedLesson.title,
            chapter: validatedLesson.chapter,
            description: validatedLesson.description,
            contentUrl: validatedLesson.contentUrl,
            courseId: validatedLesson.courseId,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      });

      //revalidate
      revalidatePath(ROUTES.COURSE_VIEW(lesson.courseId));

      return {
         success: true,
         data: lesson,
         message: "Created Successfully"
      }

      // Create the lesson in the database
   }
   catch(error) {
      return handleError(error, "create lesson");
   }
}