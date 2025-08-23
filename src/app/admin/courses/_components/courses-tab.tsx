"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GridIcon, ListIcon, RefreshCw } from "lucide-react"
import { CoursesDataTable } from "./courses-data-table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
// @ts-ignore - transient resolution until TS server picks up the file
import CourseGrid from "./course-grid"

interface CoursesTabsProps {
   coursesData: CourseModel[]
   className?: string
}

const STORAGE_KEY = "ems:courses:view"
const DEFAULT_VIEW = "list"

const CoursesTabs = ({ coursesData, className }: CoursesTabsProps) => {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const queryView = searchParams?.get("view")

   const [view, setView] = useState<string>(queryView || DEFAULT_VIEW)
   const [refreshing, setRefreshing] = useState(false)

   // Derive counts (memoized for performance on large arrays)
   const counts = useMemo(() => {
      const total = coursesData.length
      let published = 0
      let draft = 0
      let archived = 0
      for (const c of coursesData) {
         if (c.status === "Published") published++
         else if (c.status === "Draft") draft++
         else if (c.status === "Archive") archived++
      }
      return { total, published, draft, archived }
   }, [coursesData])

   // Persist view to localStorage & sync with URL
   useEffect(() => {
      try {
         if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, view)
         }
      } catch {}
      const params = new URLSearchParams(searchParams?.toString())
      params.set("view", view)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
   }, [view, router, pathname, searchParams])

   // Initialize from localStorage if no explicit query
   useEffect(() => {
      if (!queryView && typeof window !== "undefined") {
         const stored = localStorage.getItem(STORAGE_KEY)
         if (stored && stored !== view) setView(stored)
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const handleChange = useCallback((value: string) => {
      setView(value)
   }, [])

   const handleRefresh = useCallback(async () => {
      setRefreshing(true)
      try {
         // Re-trigger route fetch (Next caches; router.refresh forces revalidation)
         router.refresh()
      } finally {
         setTimeout(() => setRefreshing(false), 500)
      }
   }, [router])

   

   return (
      <section className={cn("flex w-full flex-col gap-4", className)}>
         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
               <div className="flex h-10">
                  <Tabs value={view} onValueChange={handleChange} className="flex-row gap-0 bg-transparent p-0">
                     <TabsList className="bg-muted/60 p-1 gap-1 rounded-md shadow-inner">
                        <TabsTrigger value="list" className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm">
                           <ListIcon className="h-4 w-4" />
                           <span className="hidden sm:inline">List</span>
                           <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none md:text-xs">
                              {counts.total}
                           </span>
                        </TabsTrigger>
                        <TabsTrigger value="grid" className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm">
                           <GridIcon className="h-4 w-4" />
                           <span className="hidden sm:inline">Grid</span>
                           <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none md:text-xs">
                              {counts.total}
                           </span>
                        </TabsTrigger>
                     </TabsList>
                  </Tabs>
               </div>
               <Separator orientation="vertical" className="hidden h-6 md:block" />
               <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Published {counts.published}</span>
                  <span className="hidden sm:inline">• Draft {counts.draft}</span>
                  {counts.archived > 0 && <span className="hidden sm:inline">• Archived {counts.archived}</span>}
               </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
               <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={cn("mr-1 h-3.5 w-3.5", refreshing && "animate-spin")}/> Refresh
               </Button>
            </div>
         </div>

         <Tabs value={view} onValueChange={handleChange} className="mt-2">
            <TabsContent value="list" className="mt-0 focus-visible:outline-none">
               <h2 className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">All Courses</h2>
               <CoursesDataTable data={coursesData} />
            </TabsContent>
            <TabsContent value="grid" className="mt-0 focus-visible:outline-none">
               <CourseGrid courses={coursesData} />
            </TabsContent>
         </Tabs>
      </section>
   )
}

export default CoursesTabs