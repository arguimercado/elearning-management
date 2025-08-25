import PageHeader from "@/components/commons/misc/page-header";
import { ROUTES } from "@/model/constants/router";
import TabViewCourse from "./_components/tab-view-course";
import { getCourseByIdQuery, GetCourseResponse } from "@/lib/data/admin/course/queries/getCourseByIdQuery";
import NoCourse from "../../_components/no-course";

interface CourseViewPageProps {
   params: { id: string }
}

const CourseViewPage = async ({ params }: CourseViewPageProps) => {
   const course  = await getCourseByIdQuery(params.id);

   if (!course || !course.success) {
      return <NoCourse />
   }
   if (!('data' in course) || !course.data) {
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
         <TabViewCourse course={course.data} />
      </div>
   );
};
export default CourseViewPage;
