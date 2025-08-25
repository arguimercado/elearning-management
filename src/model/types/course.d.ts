
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
  courseLessons?: CourseLessonModel[];
}

declare interface CourseLessonModel {
  id: string;
  title: string;
  description?: string | null;
  contentUrl: string;
  chapter: number;
  courseId: string;
}