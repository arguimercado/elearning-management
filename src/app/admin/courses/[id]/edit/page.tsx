
import PageHeader from "@/components/commons/misc/page-header";
import { ROUTES } from "@/model/constants/router";
import CourseFormComponent from "../../_components/course-form";
import { getCourseById } from "@/lib/data/course/getCourseById";
import NoCourse from "../../_components/no-course";

const CourseEditPage = async ({params} : {params: {id: string}}) => {
  const course  = await getCourseById(params.id);
  
  if(!course || !course?.success) {
    return (<NoCourse />)
  }

  const handleFormSubmit = async (values: any) => {
    // Call the server action to update course
    console.log("Updated Course Data:", values);
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Course"
        description="Make changes to the course details below."
        backButtonHref={ROUTES.COURSE_LIST}
        showBackButton
      />
      <CourseFormComponent
        isEdit={true} 
        initialValues={course?.data || undefined} />
    </div>
  )
}
export default CourseEditPage