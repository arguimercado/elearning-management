"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Play, FileText, Lock } from "lucide-react";
import { useState } from "react";

interface CurriculumSidebarProps {
  lessons: CourseLessonModel[];
  onSelect?: (lesson: CourseLessonModel) => void;
  activeLessonId?: string;
}

// Group lessons by chapter (string). Sort chapters naturally (Chapter 1, Chapter 2 ... / or alphabetically)
function groupLessons(lessons: CourseLessonModel[]) {

  const map: Record<string, CourseLessonModel[]> = {};
  for (const l of lessons) {
    const key = String(l.chapter ?? "General");
    map[key] ||= [];
    map[key].push(l);
  }
  // Sort lessons inside chapter by createdAt date
  Object.values(map).forEach(list => list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  // Attempt numeric sort if all numeric
  const chapterKeys = Object.keys(map).sort((a,b)=>{
    const na = Number(a), nb = Number(b);
    if(!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });
  return chapterKeys.map(k=>({ chapter: k, lessons: map[k] }));
}

export default function CurriculumSidebar({ lessons, onSelect, activeLessonId }: CurriculumSidebarProps) {
  
  const grouped = groupLessons(lessons);
  const [openItems, setOpenItems] = useState<string[]>(grouped.slice(0,3).map(g=>g.chapter));

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b">
        <p className="text-sm font-semibold tracking-wide">Course Content</p>
        <p className="text-xs text-muted-foreground">{lessons.length} lessons • {grouped.length} chapters</p>
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="multiple" value={openItems} onValueChange={(v)=>setOpenItems(v as string[])} className="w-full">
          {grouped.map(group => (
            <AccordionItem key={group.chapter} value={group.chapter}>
              <AccordionTrigger>
                <div className="flex flex-row justify-between items-start gap-4 py-0 px-3">
                  <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">Chapter {group.chapter}</span>
                  <span className="text-[11px] text-muted-foreground">{group.lessons.length} lesson{group.lessons.length>1?"s":""}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {group.lessons.map(lesson => {
                    const active = lesson.id === activeLessonId;
                    const locked = false; // Placeholder for future logic
                    return (
                      <li key={lesson.id}>
                        <Button
                          type="button"
                          variant={"outline"}
                          onClick={()=>onSelect?.(lesson)}
                          className={cn(
                            "w-full flex items-start gap-2 rounded-md border border-transparent px-2 py-2 text-left text-sm transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active && "bg-accent/70 text-foreground font-medium",
                          )}
                        >
                          {locked ? (
                            <Lock className="size-4 text-muted-foreground mt-0.5" />
                          ) : lesson.contentUrl ? (
                            <Play className="size-4 text-primary mt-0.5" />
                          ) : (
                            <FileText className="size-4 text-muted-foreground mt-0.5" />
                          )}
                          <span className="flex-1 leading-snug">
                            {lesson.title}
                          </span>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
