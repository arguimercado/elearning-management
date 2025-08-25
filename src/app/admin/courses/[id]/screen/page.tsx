import PageHeader from "@/components/commons/misc/page-header"
import { getCourseByIdQuery } from "@/lib/data"
import { notFound } from "next/navigation";
import ScreenBody from "./_components/screen-body";




//get parameters

interface IProps {
   params: Promise<{ id: string }>
}

const ScreenPage = async (props : IProps) => {


   const courseId = (await props.params).id;

   const courses = await getCourseByIdQuery(courseId);
   const lessons = courses?.data?.lessons || [];
  

   if(!courses?.data) return notFound();


   return (
    <div className="space-y-6">
         <PageHeader title={courses.data.title} description={`Preview the curriculum as learners see it.`} />
         <ScreenBody lessons={lessons} />
    </div>
  )
}
export default ScreenPage