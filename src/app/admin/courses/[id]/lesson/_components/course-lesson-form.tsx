"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, type LessonSchema } from "@/model/schemas/course-schema";
import { Form, FormField } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/commons/inputs/input-field";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/commons/inputs/rich-text-editor/editor";
import { toast } from "sonner";

// Placeholder server actions (user can replace with real implementations)
// import { createLessonCommand, updateLessonCommand } from "@/lib/data/lesson";

interface CourseLessonFormProps {
  courseId: string; // parent course id
  initialValues?: Partial<LessonSchema>; // for edit mode
  onSuccess?: (lesson: LessonSchema) => void; // callback after success
  onCancel?: () => void;
}

const defaultValues: Partial<LessonSchema> = {
  title: "",
  chapter: "",
  description: "",
  contentUrl: "",
};

const CourseLessonForm = ({
  courseId,
  initialValues,
  onSuccess,
  onCancel,
}: CourseLessonFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      courseId,
    } as LessonSchema,
  });

  // Reset if initialValues change (edit mode)
  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...defaultValues,
        ...initialValues,
        courseId,
      } as LessonSchema);
    }
  }, [initialValues, form, courseId]);

  const onSubmit = (values: LessonSchema) => {
    startTransition(async () => {
      try {
        // Replace with real server action
        // const result = values.id
        //   ? await updateLessonCommand(values.id, values)
        //   : await createLessonCommand(values);

        // Simulate success
        await new Promise((r) => setTimeout(r, 500));
        toast.success(values.id ? "Lesson updated" : "Lesson created");
        onSuccess?.(values);
        form.reset({ ...defaultValues, courseId } as any);
      } catch (e: any) {
        toast.error(e.message || "Failed to save lesson");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{initialValues?.id ? "Edit Lesson" : "Add Lesson"}</CardTitle>
            <CardDescription>
              Provide lesson details. All * marked fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  control={form.control}
                  name="title"
                  label="Lesson Title"
                  placeholder="Enter lesson title"
                  required
                />
              </div>
              <InputField
                control={form.control}
                name="chapter"
                label="Chapter"
                placeholder="Chapter or section name"
                required
              />
              <InputField
                control={form.control}
                name="contentUrl"
                label="Content URL"
                placeholder="https://... (video, pdf, etc.)"
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Description
                      </label>
                      <RichTextEditor
                        value={field.value}
                        onChange={(html) => field.onChange(html)}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onCancel?.()}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : initialValues?.id ? "Update Lesson" : "Create Lesson"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseLessonForm;