import PageHeader from "@/components/commons/misc/page-header";
import { ROUTES } from "@/model/constants/router";
import TabViewCourse from "./_components/tab-view-course";
import { getCourseById } from "@/lib/data/course/getCourseById";
import NoCourse from "../../_components/no-course";

interface CourseViewPageProps {
   params: { id: string }
}

const CourseViewPage = async ({ params }: CourseViewPageProps) => {
   const course = await getCourseById(params.id);

   if(!course || !course.success || !course.data) {
      return <NoCourse />
   }

   return (
      <div className="space-y-6">
         <PageHeader
            title="View Course"
            description="Here are the details for the selected course."
            backButtonHref={ROUTES.COURSE_LIST}
            showBackButton
         />
         <TabViewCourse course={course.data as any} />
      </div>
   );
};
export default CourseViewPage;
