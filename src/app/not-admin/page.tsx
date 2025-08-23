import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, ShieldX } from "lucide-react"
import Link from "next/link"


const NotAdminRoute = () => {
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Restricted</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-center">You do not have permission to view this page.</p>
          <Link href="/" className="text-center  text-destructive">
            <ArrowLeftIcon className="inline-block mr-2 h-4 w-4" />
            Go back to home
          </Link>
        </CardContent>
      </Card>

    </div>
  )
}
export default NotAdminRoute