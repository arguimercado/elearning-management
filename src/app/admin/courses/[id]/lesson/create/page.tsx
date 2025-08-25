import PageHeader from "@/components/commons/misc/page-header";
import CourseLessonForm from "../_components/course-lesson-form";

interface PageProps {
   params: Promise<{ id: string }>; // Next.js (app router) async params
}

const LessonFormPage = async (props : PageProps) => {

   const courseId = (await props.params).id;
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
