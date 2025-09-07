import {HeroComponentPart,PriceCardPart} from "./_components/";

import { fetchCourse, levelColors } from "./_libs/courselib";
import CourseNotFoundPart from "./_components/CourseNotFoundPart";
import { AboutCoursePart } from "./_components";
import { headers } from "next/dist/server/request/headers";
import { auth } from "@/lib/auth";
import { getStudentQuery } from "@/lib/data/clients/queries/getStudentQuery";


interface PageProps {
   params: Promise<{ courseId: string }>; // Next.js (app router) async params
}

const CoursePage = async (props: PageProps) => {

   const { courseId } = await props.params;
   const course = await fetchCourse(courseId);

   if (!course) {
      return (<CourseNotFoundPart />);
   }

   const session = await auth.api.getSession({
      headers: await headers(),
   });
  

   return (
      <div className="flex flex-col">
         {/* Hero */}
         <HeroComponentPart
            course={course}
            levelColors={levelColors}
         />

         {/* Main Content */}
         <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 py-10">
            {/* Left: Description & Outline */}
            <AboutCoursePart course={course} />
            {/* Right: Price Card */}
            <div className="lg:col-span-4 lg:pt-2">
              <PriceCardPart 
                  course={course} 
                  enableEnrollButton={!!session} 
                  userId={session?.user.id ?? ""}   
               />
            </div>
         </div>
      </div>
   );
};

export default CoursePage;