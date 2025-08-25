"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/model/constants/router"
import { ColumnHelpers } from "@/components/commons/data/columns/column-template"

export const columns: ColumnDef<CourseModel>[] = [
  ColumnHelpers.text<CourseModel>({
    accessorKey: "title",
    header: "Title",
    render: (v) => <span className="font-medium">{v}</span>,
  }),
  ColumnHelpers.text<CourseModel>({
    accessorKey: "category",
    header: "Category",
    render: (v) => <Badge variant="outline">{v}</Badge>,
  }),
  ColumnHelpers.badge<CourseModel>({
    accessorKey: "level",
    header: "Level",
    valueMap: undefined,
    colorMap: {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    },
  }),
  ColumnHelpers.text<CourseModel>({
    accessorKey: "duration",
    header: "Duration",
    enableSorting: false,
    render: (v) => (
      <div className="flex items-center"><Clock className="mr-1 h-4 w-4 text-muted-foreground" />{v}</div>
    ),
  }),
  ColumnHelpers.currency<CourseModel>({
    accessorKey: "price",
    header: "Price",
    prefixIcon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  }),
  ColumnHelpers.badge<CourseModel>({
    accessorKey: "status",
    header: "Status",
    colorMap: {
      Draft: "bg-gray-100 text-gray-800",
      Published: "bg-green-100 text-green-800",
      Archive: "bg-red-100 text-red-800",
    },
  }),
  ColumnHelpers.date<CourseModel>({
    accessorKey: "createdAt",
    header: "Created",
    formatString: "PP",
  }),
  ColumnHelpers.actions<CourseModel>({
    cell: (row) => {
      const course = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.COURSE_VIEW(course.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${ROUTES.COURSE_EDIT(course.id)}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
]
