"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import PageHeader from "@/components/commons/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/model/constants/router";
import { COURSE_CATEGORIES, generateSlug } from "@/model/schemas/course-schema";
import { createCourse } from "@/lib/actions/course-action";
import { Save, Eye, X } from "lucide-react";

// Simplified form schema for this component
const courseFormSchema = z.object({
  title: z.string().min(3, "Course title must be at least 3 characters").max(100, "Course title must be less than 100 characters"),
  description: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().min(1, "Course category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  duration: z.string().min(1, "Course duration is required"),
  price: z.coerce.number().min(0, "Price cannot be negative").max(9999.99, "Price cannot exceed $9,999.99"),
  status: z.enum(["Draft", "Published", "Archive"]),
  thumbnail: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

const CourseFormPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema) as any,
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

  const onSubmit = (values: CourseFormData) => {
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
        title="Create Course"
        description="Fill in the details below to create a new course"
        backButtonHref={ROUTES.DASHBOARD_COURSES}
        showBackButton
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the basic details for the new course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control as any}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title <span className="text-destructive ml-1">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course title" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear and descriptive title for your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Category */}
                <FormField
                  control={form.control as any}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category <span className="text-destructive ml-1">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COURSE_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Level */}
                <FormField
                  control={form.control as any}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the appropriate difficulty level for your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control as any}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration <span className="text-destructive ml-1">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 4 weeks, 10 hours" {...field} />
                      </FormControl>
                      <FormDescription>
                        Specify the course duration
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control as any}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Set to 0 for free courses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control as any}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Archive">Archive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Draft courses are not visible to students
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control as any}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of your course..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe what students will learn and achieve in this course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media & SEO Card */}
          <Card>
            <CardHeader>
              <CardTitle>Media & SEO</CardTitle>
              <CardDescription>
                Add course thumbnail and optimize for search engines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail */}
                <FormField
                  control={form.control as any}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Thumbnail</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                          {field.value && (
                            <div className="relative">
                              <img
                                src={field.value}
                                alt="Thumbnail preview"
                                className="w-full h-32 object-cover rounded-md border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => form.setValue("thumbnail", "")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter a valid image URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Auto-generated Slug */}
                <FormField
                  control={form.control as any}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="course-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Auto-generated from title. Used in course URL.
                      </FormDescription>
                      {field.value && (
                        <div className="p-3 bg-muted rounded-md mt-2">
                          <p className="text-sm text-muted-foreground">Course URL:</p>
                          <p className="text-sm font-mono break-all">
                            /courses/{field.value}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
                onClick={() => form.setValue("status", "Draft")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => form.setValue("status", "Published")}
              >
                {isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Create & Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CourseFormPage;
