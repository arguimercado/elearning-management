"use client"

import Link from "next/link"
import { ROUTES } from "@/model/constants/router"
import CourseCard from "@/components/commons/misc/course-card"

interface CourseGridProps {
  courses: CourseModel[]
}

export default function CourseGrid({ courses }: CourseGridProps) {
  if (!courses?.length) {
    return (
      <div className="grid place-items-center rounded-lg border py-16 text-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">No courses found.</p>
          <p className="text-xs text-muted-foreground/70">Create a course to populate this view.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map(course => (
        <Link key={course.id} href={`${ROUTES.COURSE_LIST}/${course.id}`} prefetch className="group">
          <CourseCard showEditButton={true} showMoreButton={false} course={course} />
        </Link>
      ))}
    </div>
  )
}
