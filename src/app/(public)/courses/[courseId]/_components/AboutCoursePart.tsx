import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle } from "lucide-react"

interface IProps {
  course : CourseModel
  
}

const AboutCoursePart = ({ course }: IProps) => {
  return (
    <div className="lg:col-span-8 space-y-10">
               {/* Full Description */}
               {course.description && (
                  <Card className="border-muted/60">
                     <CardHeader>
                        <CardTitle className="text-lg">
                           About this course
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div
                           className="prose prose-sm sm:prose dark:prose-invert !max-w-none"
                           dangerouslySetInnerHTML={{
                              __html: course.description,
                           }}
                        />
                     </CardContent>
                  </Card>
               )}

               {/* Curriculum */}
               {course.lessons && course.lessons.length > 0 && (
                  <Card className="border-muted/60">
                     <CardHeader>
                        <CardTitle className="text-lg">
                           Course Outline
                        </CardTitle>
                        <CardDescription>
                           {course.lessons.length} lesson
                           {course.lessons.length > 1 ? "s" : ""}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        <ol className="space-y-3 counter-reset list-decimal">
                           {course.lessons.map((l: CourseLessonModel, idx: number) => (
                              <li
                                 key={l.id}
                                 className="flex gap-3 rounded-md border bg-muted/30 p-3 text-sm items-start"
                              >
                                 <div className="mt-0.5 text-muted-foreground font-medium">
                                    {idx + 1}.
                                 </div>
                                 <div className="flex-1 space-y-1 flex flex-row justify-between">
                                    <div className="font-medium leading-snug flex items-center gap-2">
                                       <PlayCircle className="h-4 w-4 text-primary/70" />
                                       {l.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {l.duration}
                                    </div>
                                 </div>
                              </li>
                           ))}
                        </ol>
                     </CardContent>
                  </Card>
               )}
            </div>
  )
}
export default AboutCoursePart