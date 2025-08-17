"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageHeader from "@/components/commons/page-header";
import { ROUTES } from "@/model/constants/router";
import { CourseSchema, courseSchema } from "@/model/schemas/course-schema";
import { createCourse } from "@/lib/actions/course-action";
import CourseFormComponent from "./_components/course-form";
import {generateSlug} from "@/lib/hooks/util";
import CourseForm from "./_components/course-form";




const CourseFormPage = () => {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      category: "",
      level: "BEGINNER",
      duration: "",
      price: 0,
      status: "Draft",
      thumbnail: "",
    },
  });

  const watchTitle = form.watch("title");

  // Auto-generate slug when title changes
  useEffect(() => {
    if (watchTitle) {
      const slug = generateSlug(watchTitle);
      form.setValue("slug", slug);
    }
  }, [watchTitle, form]);

  const onSubmit = (values: CourseSchema) => {
    startTransition(async () => {
      try {
        console.log("Course Data:", values);
        // Call the server action to create course
        const result = await createCourse(values);
        
        if (result?.success) {
          toast.success(result.message || "Course created successfully!");
          router.push(ROUTES.DASHBOARD_COURSES);
        } else {
          throw new Error("Failed to create course");
        }
      } catch (error) {
        console.error("Error creating course:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create course. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Course"
        description="Fill in the details below to create a new course"
        backButtonHref={ROUTES.DASHBOARD_COURSES}
        showBackButton
      />
      <CourseFormComponent 
        form={form} 
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={() => router.push(ROUTES.DASHBOARD_COURSES)}
      />
    </div>
  );
};

export default CourseFormPage;
