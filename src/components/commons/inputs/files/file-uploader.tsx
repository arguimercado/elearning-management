"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { RenderEmptyState, RenderErrorState } from "./render-state";
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

const FileUploader = () => {
   const [fileState, setFileState] = useState<UploadState>({
      isError: false,
      file: null,
      id: null,
      uploading: false,
      progress: 0,
      isDeleting: false,
      fileType: "image",
   });

   const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
         const file = acceptedFiles[0];

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
      }
   }, []);

   const uploadFile = async (file: File) => {
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
                  toast.success("File uploaded successfully");
                  resolve(xhr.response);
               } else {
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
   };

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

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: { "image/*": [] },
      maxFiles: 1,
      multiple: false,
      maxSize: 5 * 1024 * 1024, //5mb
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
            <RenderEmptyState isDragActive={isDragActive} />
         </CardContent>
      </Card>
   );
};
export default FileUploader;
