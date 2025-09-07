const CourseNotFoundPart = () => {
   return (
      <div className="container py-24 text-center">
         <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Course not found
         </h1>
         <p className="text-muted-foreground">
            The course you&apos;re looking for doesn&apos;t exist or is
            unavailable.
         </p>
      </div>
   );
};
export default CourseNotFoundPart;
