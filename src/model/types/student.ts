declare interface StudentModel {
   id: string;
   name: string;
   email: string;
   avatar?: string | null;
   role: string;
   createdAt?: Date;
   updatedAt?: Date;
   enrolledCourses?: CourseModel[];
}