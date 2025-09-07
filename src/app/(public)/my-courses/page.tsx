import PageHeader from "@/components/commons/misc/page-header"

const MyCoursesPage = () => {
  return (
   <div className="space-y-6">
      <div className="w-full bg-neutral-600 text-slate-50 dark:bg-neutral-300 dark:text-white flex flex-col items-center justify-center py-10 px-4">
         <h1 className="text-7xl font-bold">My Courses</h1>
      </div>
      <div>
         {/* Course list component goes here */}
         <p>Your enrolled courses will be displayed here.</p>
      </div>
   </div>
  )
}
export default MyCoursesPage