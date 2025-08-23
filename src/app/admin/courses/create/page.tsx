
import PageHeader from "@/components/commons/page-header";
import { ROUTES } from "@/model/constants/router";
import CourseFormComponent from "./_components/course-form";
import { requireAdminAccess } from "@/lib/data/admin/user-session";




const CourseFormPage = async () => {

  const session = await requireAdminAccess();

  if (session === null) {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Course"
        description="Fill in the details below to create a new course"
        backButtonHref={ROUTES.DASHBOARD_COURSES}
        showBackButton
      />
      <CourseFormComponent />
    </div>
  );
};

export default CourseFormPage;
