"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormField} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {COURSE_CATEGORIES, courseSchema, CourseSchema} from "@/model/schemas/course-schema";
import {Eye, Save} from "lucide-react";
import InputField from "@/components/commons/inputs/input-field";
import SelectField from "@/components/commons/inputs/select-field";
import {useForm} from "react-hook-form";
import RichTextEditor from "@/components/commons/inputs/rich-text-editor/editor";
import FileUploader from "@/components/commons/inputs/files/file-uploader";
import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateSlug } from "@/lib/hooks/util";
import { toast } from "sonner";
import { ROUTES } from "@/model/constants/router";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "@/lib/data/course";

const defaultValues: CourseSchema = {
  title: "",
  description: "",
  slug: "",
  category: "",
  level: "BEGINNER",
  duration: "",
  price: 0,
  status: "Draft",
  thumbnail: "",
};

const useCourseForm = (isEdit: boolean, initialValues?: CourseSchema) => {

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: initialValues ? initialValues : defaultValues
  });

   const watchTitle = form.watch("title");

  // Auto-generate slug when title changes
  useEffect(() => {
    if (watchTitle) {
      const slug = generateSlug(watchTitle);
      form.setValue("slug", slug);
    }
  }, [watchTitle, form]);

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues]);

  const onSubmit = (values: CourseSchema) => {
    startTransition(async () => {
      try {
        console.log("Course Data:", values);
        if(isEdit) {
          const result = await updateCourse(values.id ?? "", values);
          if (result?.success) {
            toast.success(result.message || "Updated successfully!");
            router.push(ROUTES.COURSE_LIST);
          } else {
            throw new Error("Failed to update course");
          }
        }
        else {
          // Call the server action to create course
          const result = await createCourse(values);
          if (result?.success) {
            toast.success(result.message || "Course created successfully!");
            router.push(ROUTES.COURSE_LIST);
          } else {
            throw new Error("Failed to create course");
          }

        }
        
      } 
      catch (error) {
        console.error("Error creating course:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create course. Please try again.");
      }
    });
  };
  const onCancel = () => {
    router.push(ROUTES.COURSE_LIST);
  };
  return {
    form,
    onSubmit,
    isPending,
    onCancel,
  };

}

interface IProps  {
  initialValues?: CourseSchema;
  isEdit?: boolean;
  onSubmitForm?: (values: CourseSchema) => void;
}

const CourseFormComponent = ({initialValues, isEdit = false, onSubmitForm} : IProps) => {

  const {form, onSubmit,isPending,onCancel} = useCourseForm(isEdit, initialValues);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the basic details for the new course.
              {form.watch("id")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <InputField
                  control={form.control}
                  name="title"
                  label="Course Title"
                  placeholder="Enter course title"
                  description="A clear and descriptive title for your course"
                  required
                />
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={"description"}
                  render={({field}) => (
                    <div className={"flex flex-col"}>
                      <label className="block text-sm font-medium mb-2">
                        Course Content
                      </label>
                      <RichTextEditor value={field.value} onChange={(html) => field.onChange(html)}/>
                    </div>
                  )}
                />
              </div>

              <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <SelectField
                  control={form.control}
                  name="category"
                  triggerClassName="w-full"
                  label="Category"
                  placeholder="Select a category"
                  description="The category this course falls under"
                  required
                  options={COURSE_CATEGORIES.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                />
                {/* Level */}
                <SelectField
                  control={form.control}
                  triggerClassName="w-full"
                  name="level"
                  label="Course Level"
                  placeholder="Select course level"
                  description="The level of the course"
                  required
                  options={[
                    {value: "BEGINNER", label: "Beginner"},
                    {value: "INTERMEDIATE", label: "Intermediate"},
                    {value: "ADVANCED", label: "Advanced"},
                  ]}
                />
                {/* Status */}
                <SelectField
                  control={form.control}
                  triggerClassName="w-full"
                  name="status"
                  label="Course Status"
                  placeholder="Select Course Status"
                  description="The current status of the course"
                  required
                  options={[
                    {value: "Draft", label: "Draft"},
                    {value: "Published", label: "Published"},
                    {value: "Archived", label: "Archived"},
                  ]}
                />

              </div>


              {/* Duration */}
              <InputField
                control={form.control}
                name="duration"
                label="Duration"
                placeholder="e.g., 4 weeks, 10 hours"
                description="Specify the course duration"
                required
              />

              {/* Price */}
              <InputField
                control={form.control}
                name="price"
                type="number"
                label="Price ($)"
                placeholder="0.00"
                description="Set to 0 for free courses"
                required
              />


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
              <div className="flex flex-col">
                {/* Thumbnail */}
                <FormField 
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FileUploader
                      isPreview={isEdit}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
             
              </div>
              <div className="flex flex-col">
                {/* Auto-generated Slug */}
                <InputField
                  control={form.control}
                  name="slug"
                  label="Course Slug"
                  description="Auto-generated from course title"
                  placeholder="Course Slug"
                />

                {/* Preview of url */}
                {form.watch("slug") && (
                  <div className="p-3 bg-muted rounded-md mt-2">
                    <p className="text-sm text-muted-foreground">
                      Course URL:
                    </p>
                    <p className="text-sm font-mono break-all">
                      /courses/{form.watch("slug")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
              <Save className="mr-2 h-4 w-4"/>
              Save as Draft
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              onClick={() => form.setValue("status", "Published")}
            >
              {isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"/>
                  Creating...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4"/>
                  Create & Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
export default CourseFormComponent