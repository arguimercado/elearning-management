import { fetchPreviewCourseQuery } from "@/lib/data";
import { getImageUrl } from "@/lib/utils";
import { Metadata } from "next";



export const levelColors: Record<string, string> = {
   BEGINNER:
      "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
   INTERMEDIATE:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
   ADVANCED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};


export async function fetchCourse(courseId: string) {

   const res = await fetchPreviewCourseQuery(courseId);
   
   return res.data || null;
}



export async function generateMetadata(courseId: string): Promise<Metadata> {
   const course = await fetchCourse(courseId);
   if (!course) return { title: "Course not found" };
   return {
      title: `${course.title} | Course`,
      description: course.description?.slice(0, 150),
      openGraph: {
         title: course.title,
         description: course.description || undefined,
         images: course.thumbnail
            ? [{ url: getImageUrl(course.thumbnail) }]
            : undefined,
      },
   };
}