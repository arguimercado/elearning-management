"use client";

import { Card, CardContent } from "@/components/ui/card";
import CurriculumSidebar from "./curriculum-sidebar";
import VideoPreview from "./video-preview";
import { useState } from "react";

interface IProps {
   lessons: CourseLessonModel[];
}

const ScreenBody = ({ lessons }: IProps) => {
   const [selectedLesson, setSelectedLesson] = useState<CourseLessonModel | null>(null);

   const handleSelect = (lesson: CourseLessonModel) => {
      setSelectedLesson(lesson);
   };

   return (
      <div className="flex flex-row w-full border rounded-lg overflow-hidden min-h-[600px]">
         <aside className="w-[340px] bg-muted/30 border-r">
            <CurriculumSidebar 
               onSelect={handleSelect}
               lessons={lessons ?? []} />
         </aside>
         <main className="flex-1 p-6">
            <Card className="h-full">
               <CardContent>
                  {selectedLesson ? (
                     <VideoPreview previewUrl={selectedLesson?.contentUrl} />
                  ) : (
                     <div className="text-center text-muted">
                        Select a lesson to preview
                     </div>
                  )}
               </CardContent>
            </Card>
         </main>
      </div>
   );
};
export default ScreenBody;
