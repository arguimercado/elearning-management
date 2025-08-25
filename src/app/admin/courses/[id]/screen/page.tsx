import PageHeader from "@/components/commons/misc/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseByIdQuery } from "@/lib/data"
import CurriculumSidebar from "./_components/curriculum-sidebar";
import { notFound } from "next/navigation";
import VideoPreview from "./_components/video-preview";
import ScreenBody from "./_components/screen-body";



async function useScreen(id: string) {
   const courses = await getCourseByIdQuery(id);
   console.log(courses);
   const lessons = courses?.data?.lessons || [];
   return { courses, lessons };
}

//get parameters

interface IProps {
   params: { id: string }
}

const ScreenPage = async (props : IProps) => {
   const courseId = props.params.id;
  
   const { courses, lessons } = await useScreen(courseId);
   console.log(courses.data?.lessons);


   if(!courses?.data) return notFound();


   return (
    <div className="space-y-6">
         <PageHeader title={courses.data.title} description={`Preview the curriculum as learners see it.`} />
         <ScreenBody lessons={lessons} />
    </div>
  )
}
export default ScreenPage