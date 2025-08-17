"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

interface CoursesDataTableProps {
  data: CourseModel[]
}

export function CoursesDataTable({ data }: CoursesDataTableProps) {
  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="title"
        searchPlaceholder="Search courses..."
      />
    </div>
  )
}
