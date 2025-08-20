import { cn } from "@/lib/utils"
import { CloudUploadIcon, ImageIcon } from "lucide-react"

export const RenderEmptyState = ({isDragActive} : {isDragActive: boolean}) => {
   return(
      <div className="text-center">
         <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
            <CloudUploadIcon className={cn("size-6 mx-auto h-6 w-6 text-muted-foreground", isDragActive && "text-primary")} />
         </div>
         <p className="text-base font-semibold text-foreground">Drop your files here or <span className="text-primary font-bold cursor-pointer">click to upload</span></p>
      </div>
   )
}
export const RenderErrorState = () => {
   return(
      <div className="text-center">
         <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
            <ImageIcon className={"size-6 mx-auto h-6 w-6 text-destructive"} />
         </div>
         <p className="text-base font-semibold text-destructive">Upload Failed</p>
         <p className="text-sm text-destructive">Please try again later.</p>
      </div>
   )
}
  
