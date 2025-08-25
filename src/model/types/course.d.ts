
declare interface CourseModel {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  status: string;
  thumbnail?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  lessons?: CourseLessonModel[];
}

declare interface CourseLessonModel {
  id: string;
  title: string;
  description?: string | null | undefined;
  contentUrl?: string | null | undefined;
  chapter: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}