"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/commons/page-header";
import StatusCard from "@/components/commons/status-card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
   Plus,
   Search,
   Filter,
   MoreHorizontal,
   Edit,
   Eye,
   Trash2,
   BookOpen,
   Clock,
   DollarSign,
   Users,
} from "lucide-react";
import { ROUTES } from "@/model/constants/router";
import { getCourses } from "@/lib/actions/course-action";
import React from "react";
import { Pagination } from "@/model/types/global";

// Mock data - replace with actual API call
const mockCourses = [
   {
      id: "1",
      title: "Introduction to React",
      description: "Learn the basics of React development",
      instructor: "John Doe",
      category: "Programming",
      level: "Beginner",
      duration: "8 weeks",
      price: 99.99,
      isPublished: true,
      thumbnail: null,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-02-01"),
      students: 156,
   },
   {
      id: "2",
      title: "Advanced JavaScript",
      description: "Master advanced JavaScript concepts",
      instructor: "Jane Smith",
      category: "Programming",
      level: "Advanced",
      duration: "12 weeks",
      price: 149.99,
      isPublished: true,
      thumbnail: null,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-25"),
      students: 89,
   },
   {
      id: "3",
      title: "UI/UX Design Fundamentals",
      description: "Learn the principles of user interface design",
      instructor: "Mike Johnson",
      category: "Design",
      level: "Intermediate",
      duration: "6 weeks",
      price: 79.99,
      isPublished: false,
      thumbnail: null,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-15"),
      students: 0,
   },
   {
      id: "4",
      title: "Digital Marketing Strategy",
      description: "Complete guide to digital marketing",
      instructor: "Sarah Wilson",
      category: "Marketing",
      level: "Beginner",
      duration: "10 weeks",
      price: 129.99,
      isPublished: true,
      thumbnail: null,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-02-10"),
      students: 234,
   },
];

interface CoursesPageProps {
   searchParams?: {
      search?: string;
      category?: string;
      level?: string;
      status?: string;
      page?: string;
      limit?: string;
   };
}



const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
   // Fetch courses data on the server
   let coursesData: Pagination<Course> = {} as Pagination<Course>;
   let error: string | null = null;

   try {
      const result = await getCourses(searchParams);
      if (result?.success) {
         coursesData = result.data;
      } else {
         error = "Failed to fetch courses";
      }
   } catch (err) {
      error = err instanceof Error ? err.message : "Failed to fetch courses";
   }

   const stats = coursesData
      ? {
           totalCourses: coursesData.totalCount,
           publishedCourses: coursesData.data.filter(
              (c: any) => c.status === "Published"
           ).length,
           draftCourses: coursesData.data.filter(
              (c: any) => c.status === "Draft"
           ).length,
           totalRevenue: coursesData.data
              .filter((c: any) => c.status === "Published")
              .reduce((sum: number, course: any) => sum + course.price, 0),
        }
      : {
           totalCourses: 0,
           publishedCourses: 0,
           draftCourses: 0,
           totalRevenue: 0,
        };

   return (
      <div className="space-y-6">
         {/* Header Section */}
         <PageHeader
            title="Courses"
            description="Manage your courses and track their performance"
         >
            <Button className="w-full sm:w-auto" asChild>
               <Link href={ROUTES.DASHBOARD_CREATE}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
               </Link>
            </Button>
         </PageHeader>

         {/* Stats Cards */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatusCard
               title="Total Courses"
               value={stats.totalCourses}
               icon={BookOpen}
            />
            <StatusCard
               title="Published"
               value={stats.publishedCourses}
               icon={Eye}
            />
            <StatusCard
               title="Drafts"
               value={stats.draftCourses.toString()}
               description="Courses in development"
               icon={Clock}
            />
            <StatusCard
               title="Total Revenue"
               value={`$${stats.totalRevenue.toFixed(2)}`}
               description="From published courses"
               icon={DollarSign}
            />
         </div>
      </div>
   );
};

export default CoursesPage;
