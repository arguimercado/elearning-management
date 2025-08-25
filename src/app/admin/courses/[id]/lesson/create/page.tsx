import PageHeader from "@/components/commons/misc/page-header";
import CourseLessonForm from "../_components/course-lesson-form";

const LessonFormPage = (props : { params: { id: string } }) => {

   const courseId = props.params.id;
   
   return (
      <div>
         <PageHeader
            title="Lesson Form"
            description="Create or edit a lesson"
         />
         <CourseLessonForm courseId={courseId} />
      </div>
   );
};
export default LessonFormPage;
