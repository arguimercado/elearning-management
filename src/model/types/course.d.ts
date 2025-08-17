
declare interface CourseModel {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: string;
  price: number;
  status: "Draft" | "Published" | "Archive";
  thumbnail?: string | null;
  createdAt: Date;
  updatedAt: Date;
}