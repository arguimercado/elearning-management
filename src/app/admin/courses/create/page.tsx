import PageHeader from "@/components/commons/misc/page-header";
import { ROUTES } from "@/model/constants/router";
import CourseFormComponent from "../_components/course-form";

const CourseFormPage = () => {
   return (
      <div className="space-y-6">
         <PageHeader
            title="Create Course"
            description="Fill in the details below to create a new course"
            backButtonHref={ROUTES.COURSE_LIST}
            showBackButton
         />
         <CourseFormComponent isEdit={false} />
      </div>
   );
};

export default CourseFormPage;
