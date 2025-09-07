//@typescript-eslint/no-explicit-any
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, getImageUrl } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./render-state";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploadState {
   id: string | null;
   file: File | null;
   uploading: boolean;
   progress: number;
   key?: string;
   isDeleting: boolean;
   isError: boolean;
   objectUrl?: string;
   fileType: "image" | "video";
}

interface IProps {
   value?: string | null
   onChange?: (value: string) => void
   isPreview: boolean
}

const FileUploader = ({value, onChange, isPreview = false}: IProps) => {

   const [fileState, setFileState] = useState<UploadState>({
      isError: false,
      file: null,
      id: null,
      uploading: false,
      progress: 0,
      isDeleting: false,
      fileType: "image",
      key: value || undefined,
   });

   const uploadFile = useCallback(async (file: File) => {
      setFileState((prev) => ({
         ...prev,
         uploading: true,
         progress: 0,
         isError: false,
      }));

      try {
         //1. Get Presigned Url
         const presigneResponse = await fetch("/api/s3/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               fileName: file.name,
               contentType: file.type,
               size: file.size,
               isImage: true,
            }),
         });

         if (!presigneResponse.ok) {
            toast.error("Failed to get presigned URL");
            setFileState((prev) => ({
               ...prev,
               progress: 0,
               uploading: false,
               isError: true,
            }));

            return;
         }

         const { presignedUrl, key } = await presigneResponse.json();


         await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (event) => {
               if (event.lengthComputable) {
                  const percent = (event.loaded / event.total) * 100;
                  setFileState((prev) => ({
                     ...prev,
                     progress: Math.round(percent),
                  }));
               }
            };

            xhr.onload = () => {
               if (xhr.status === 200 || xhr.status === 204) {
                  setFileState((prev) => ({
                     ...prev,
                     uploading: false,
                     progress: 100,
                     key: key,
                  }));
                  onChange?.(key);
                  toast.success("File uploaded successfully");
                  resolve(xhr.response);
               } 
               else {
                  reject(new Error("Failed to upload file"));
               }
            };

            xhr.onerror = () => {
               reject(new Error("Failed to upload file"));
            };

            xhr.open("PUT", presignedUrl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
         });
      } 
      catch (error) {
         toast.error("Failed to upload file");
         setFileState((prev) => ({
            ...prev,
            progress: 0,
            uploading: false,
            isError: true,
         }));
      }
   },[]);

   const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
         const file = acceptedFiles[0];

         if(fileState.objectUrl && !fileState.objectUrl.startsWith("http:")) {
            URL.revokeObjectURL(fileState.objectUrl);
         }

         setFileState({
            file: file,
            uploading: false,
            progress: 0,
            objectUrl: URL.createObjectURL(file),
            isError: false,
            id: uuidv4(),
            isDeleting: false,
            fileType: "image",
         });

         uploadFile(file);
         
      }
   }, [fileState]);

   const handleRemoveFile = async () => {
      if(fileState.isDeleting || !fileState.objectUrl) {
         return;
      }

      try {
         setFileState((prev) => ({
            ...prev,
            isDeleting: true,
         }));

         const response = await fetch(`/api/s3/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: fileState.key }),
         });

         if (!response.ok) {
            throw new Error("Failed to delete file");
         }

         if(fileState.objectUrl && !fileState.objectUrl.startsWith("http:")) {
            URL.revokeObjectURL(fileState.objectUrl);
         }
         setFileState({
            id: null,
            file: null,
            uploading: false,
            progress: 0,
            objectUrl: undefined,
            isError: false,
            isDeleting: false,
            fileType: "image",
         });
         onChange?.("");
         toast.success("File deleted successfully");
      } 
      catch (error: any) {
         toast.error("Failed to delete file");
          setFileState((prev) => ({
               ...prev,
               isError: true,
               isDeleting: false,
            }));
      }
   }
   
   const rejectedFiles = (fileRejection: FileRejection[]) => {
      if (fileRejection.length) {
         const tooManyFiles = fileRejection.find(
            (rejections) => rejections.errors[0].code === "too-many-files"
         );
         const fileTooLarge = fileRejection.find(
            (rejections) => rejections.errors[0].code === "file-too-large"
         );

         if (tooManyFiles) {
            toast.error("Too many files selected");
         }

         if (fileTooLarge) {
            toast.error("File too large");
         }
      }
   };

   const renderContent = useCallback(({onDeleteClick} : {onDeleteClick: () => void}) => {
      if(fileState.uploading) {
         return(<RenderUploadingState progress={fileState.progress} file={fileState.file} />)
      }
      else if(fileState.isError) {
         return(<RenderErrorState />)
      }
      else if(fileState.objectUrl) {
         console.log(fileState.objectUrl);
         return <RenderUploadedState previewUrl={fileState.objectUrl} isDeleting={fileState.isDeleting} onDeleteClick={onDeleteClick} />
      }
      return <RenderEmptyState isDragActive={isDragActive} />
   }, [fileState]);

   useEffect(() => {
      return () => {
         if(fileState.objectUrl && !fileState.objectUrl.startsWith("http:")) {
            URL.revokeObjectURL(fileState.objectUrl);
         }
      }
   }, [fileState.objectUrl]);

   useEffect(() => {
      if(isPreview) {
         setFileState((prev) => ({
            ...prev,
            key: value || undefined,
            objectUrl: getImageUrl(value ?? "")
         }));
      }

   },[isPreview])

  

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      multiple: false,
      maxSize: 5 * 1024 * 1024, //5mb
      disabled: fileState.uploading || !!fileState.objectUrl || fileState.isDeleting,
      onDropRejected: rejectedFiles,
      onDrop,
   });

   return (
      <Card
         {...getRootProps()}
         className={cn(
            "relative border-dashed border-2 p-6 h-[220px] transition-colors duration-200 ease-in-out",
            isDragActive
               ? "border-primary bg-primary/10 border-solid"
               : "border-border hover:border-primary"
         )}
      >
         <CardContent className="flex items-center justify-center h-full w-full p-4">
            <input {...getInputProps()} />
            {renderContent({onDeleteClick: handleRemoveFile})}
         </CardContent>
      </Card>
   );
};
export default FileUploader;
