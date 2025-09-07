//@typescript-eslint/no-unused-vars

import PageHeader from "@/components/commons/misc/page-header";
import { ROUTES } from "@/model/constants/router";
import CourseFormComponent from "../../create/_components/course-form";
import { getCourseByIdQuery } from "@/lib/data/admin/course/queries/getCourseByIdQuery";
import NoCourse from "../../_components/no-course";
import { CourseSchema } from "@/model/schemas/course-schema";

type PageProps = {
  params: Promise<{id: string}>
}

const CourseEditPage = async ({params} : PageProps) => {
  
  const courseId = (await params).id;
  const course  = await getCourseByIdQuery(courseId);

  const courseSchema : CourseSchema = {
    id: course?.data?.id,
    title: course?.data?.title ?? "",
    description: course?.data?.description,
    duration: course?.data?.duration ?? "",
    category: course?.data?.category ?? "",
    level: (["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).includes((course?.data?.level ?? "BEGINNER") as any)
      ? course?.data?.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
      : "BEGINNER",
    price: course?.data?.price ?? 0,
    slug: course?.data?.slug ?? "",
    status: (["Draft", "Published", "Archive"] as const).includes(course?.data?.status as any)
      ? course?.data?.status as "Draft" | "Published" | "Archive"
      : "Draft",
    thumbnail: course?.data?.thumbnail ?? "",
  }
  
  if(!course || !course?.success) {
    return (<NoCourse />)
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
        initialValues={courseSchema || undefined} />
    </div>
  )
}
export default CourseEditPage