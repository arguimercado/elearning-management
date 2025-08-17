import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CourseSchema, COURSE_CATEGORIES } from "@/model/schemas/course-schema";
import { Save, Eye } from "lucide-react";
import InputField from "@/components/commons/inputs/input-field";
import SelectField from "@/components/commons/inputs/select-field";
import TextAreaField from "@/components/commons/inputs/textarea-field";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";

interface CourseFormComponentProps {
  form: UseFormReturn<CourseSchema>;
  onSubmit: (values: CourseSchema) => void;
  isPending?: boolean;
  onCancel?: () => void;
}

const CourseFormComponent = ({ form, onSubmit, isPending = false, onCancel }: CourseFormComponentProps) => {


  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                       <InputField
                          control={form.control}
                          name="title"
                          label="Course Title"
                          placeholder="Enter course title"
                          description="A clear and descriptive title for your course"
                          required
                       />
                    </div>

                    {/* Category */}
                    <SelectField
                       control={form.control}
                       name="category"
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
                       name="level"
                       label="Course Level"
                       placeholder="Select course level"
                       description="The level of the course"
                       required
                       options={[
                          { value: "BEGINNER", label: "Beginner" },
                          { value: "INTERMEDIATE", label: "Intermediate" },
                          { value: "ADVANCED", label: "Advanced" },
                       ]}
                    />

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
                    {/* Status */}
                    <SelectField
                       control={form.control}
                       name="status"
                       label="Course Status"
                       placeholder="Select Course Status"
                       description="The current status of the course"
                       required
                       options={[
                          { value: "Draft", label: "Draft" },
                          { value: "Published", label: "Published" },
                          { value: "Archived", label: "Archived" },
                       ]}
                    />
                    {/* Description */}
                    <div className="md:col-span-2">
                       <TextAreaField
                          control={form.control}
                          name="description"
                          label="Course Description"
                          placeholder="Provide a detailed description of your course..."
                          className="min-h-[120px] resize-none"
                          description="Describe what students will learn and achieve in this course"
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
                    <div className="flex flex-col">
                       {/* Thumbnail */}
                       <InputField
                          control={form.control}
                          name="thumbnail"
                          label="Course Thumbnail"
                          placeholder="https://example.com/image.jpg"
                          description="Enter a valid image URL"
                       />

                       {/* Preview the image using NextJS Image */}
                       {form.watch("thumbnail") && (
                          <Image
                             src={form.watch("thumbnail")!}
                             alt="Thumbnail preview"
                             className="w-full size-40 object-cover rounded-md border"
                             onError={(e) => {
                                e.currentTarget.style.display = "none";
                             }}
                             width={120}
                             height={120}
                          />
                       )}
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
  );
}
export default CourseFormComponent