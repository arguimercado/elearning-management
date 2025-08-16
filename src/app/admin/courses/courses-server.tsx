import React, { Suspense } from 'react';
import { getCourses } from "@/lib/actions/course-action";
import CoursesContent from "./courses-content";
import PageHeader from "@/components/commons/page-header";
import StatusCard from "@/components/commons/status-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, BookOpen, Clock, DollarSign, Users } from "lucide-react";
import { ROUTES } from "@/model/constants/router";

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

// Loading component for Suspense
function CoursesLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage your courses and track their performance"
      >
        <Link href={ROUTES.DASHBOARD_COURSES_CREATE}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

// Main server component
async function CoursesPage({ searchParams }: CoursesPageProps) {
  // Fetch courses data on the server
  let coursesData: any = null;
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

  // Mock stats calculation (in a real app, this would come from a separate action)
  const stats = coursesData ? {
    totalCourses: coursesData.pagination.totalCount,
    publishedCourses: coursesData.courses.filter((c: any) => c.status === "Published").length,
    draftCourses: coursesData.courses.filter((c: any) => c.status === "Draft").length,
    totalRevenue: coursesData.courses
      .filter((c: any) => c.status === "Published")
      .reduce((sum: number, course: any) => sum + course.price, 0)
  } : {
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalRevenue: 0
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage your courses and track their performance"
      >
        <Link href={ROUTES.DASHBOARD_CREATE}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Courses"
          value={stats.totalCourses.toString()}
          description="All courses in your account"
          icon={BookOpen}
        />
        <StatusCard
          title="Published"
          value={stats.publishedCourses.toString()}
          description="Courses available to students"
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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error loading courses</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Courses Content */}
      {coursesData && (
        <Suspense fallback={<div>Loading courses...</div>}>
          <CoursesContent
            initialData={coursesData}
            searchParams={searchParams}
          />
        </Suspense>
      )}
    </div>
  );
}

export default CoursesPage;
