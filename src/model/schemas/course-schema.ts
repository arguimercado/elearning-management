import { z } from "zod";

// Enums based on Prisma schema
export const CourseLevelEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
export const CourseStatusEnum = z.enum(["Draft", "Published", "Archive"]);

// Base course schema - matches Prisma model structure
export const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .min(3, "Course title must be at least 3 characters")
    .max(100, "Course title must be less than 100 characters"),
  description: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val.length >= 10,
      "Description must be at least 10 characters if provided"
    ),
  slug: z
    .string()
    .min(1, "Course slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  category: z
    .string()
    .min(1, "Course category is required")
    .max(50, "Category must be less than 50 characters"),
  level: CourseLevelEnum.default("BEGINNER"),
  duration: z
    .string()
    .min(1, "Course duration is required")
    .regex(
      /^(\d+)\s+(week|weeks|hour|hours|day|days|month|months)$/i,
      "Duration must be in format like '4 weeks', '10 hours', '2 months'"
    ),
  price: z.coerce
   .number()
   .min(1)
    .nonnegative("Price cannot be negative")
    .max(9999.99, "Price cannot exceed $9,999.99")
    .default(0.0),
  status: CourseStatusEnum.default("Draft"),
  thumbnail: z
    .url("Thumbnail must be a valid URL")
    .optional()
    .nullable()
})
.refine(
  (data) => {
    // Auto-generate slug from title if not provided
    return true;
  }
);



// Schema for course search/filter parameters
export const courseFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Utility schemas for specific use cases
export const courseSlugSchema = z.object({
  slug: z
    .string()
    .min(1, "Course slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
});

export const courseIdSchema = z.object({
  id: z.uuid("Invalid course ID format"),
});

// Type definitions
export type CourseSchema = z.infer<typeof courseSchema>;
export type CourseFilter = z.infer<typeof courseFilterSchema>;
export type CourseLevel = z.infer<typeof CourseLevelEnum>;
export type CourseStatus = z.infer<typeof CourseStatusEnum>;

// Course categories (you can expand this based on your needs)
export const COURSE_CATEGORIES = [
  "Programming",
  "Design",
  "Marketing",
  "Business",
  "Photography",
  "Music",
  "Health & Fitness",
  "Language Learning",
  "Personal Development",
  "Academic",
] as const;

export const courseCategorySchema = z.enum(COURSE_CATEGORIES);

// Default values for forms
export const defaultCourseFormValues: Partial<CourseSchema> = {
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
