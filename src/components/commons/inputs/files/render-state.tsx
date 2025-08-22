import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CloudUploadIcon, ImageIcon, XIcon } from "lucide-react"
import Image from "next/image"

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

export const RenderUploadedState = ({
   previewUrl,
   isDeleting,
   onDeleteClick
} : { previewUrl: string,isDeleting: boolean, onDeleteClick: () => void }) => {
  
   const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      //preventing the parent to trigger
      //e.stopPropagation();
      console.log("Delete clicked");
      onDeleteClick();
   };
   
   return (
      <div>
         <Image src={previewUrl} alt="Uploaded file preview" fill className="object-contain p-2" />
         <Button disabled={isDeleting} type="button" variant={"destructive"} size="icon" className={cn("absolute top-4 right-4")} onClick={handleDeleteClick}>
            <XIcon className="size-4"/>
         </Button>
      </div>
   )
} 


export const RenderUploadingState = ({progress,file} : {progress: number,file?: File | null}) => {
   return (
      <div>
         <p className="text-base font-semibold text-foreground">Uploading {file?.name}</p>
         <div className="relative w-full h-2 bg-muted rounded-full">
            <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
         </div>
      </div>
   )
}
