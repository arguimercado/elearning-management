import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ROUTES } from "@/model/constants/router"
import { ArrowLeftIcon, FileQuestionIcon } from "lucide-react"
import Link from "next/link"

const NoCourse = () => {
  return (
    <div className="flex items-center w-full max-w-md mx-auto justify-center h-full">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center justify-center space-y-2">
            <FileQuestionIcon className="mx-auto mb-2 size-16 text-muted-foreground" />
            <p>There is no course with this ID.</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary" asChild>
              <Link href={ROUTES.COURSE_LIST} className="w-full  flex flex-row items-center space-x-2">
                <ArrowLeftIcon className="inline-block mr-2 size-8" />
                <p>
                  Go back to course list
                </p>
              </Link>

            </Button>

          </CardContent>
        </Card>
      </div>
  )
}
export default NoCourse