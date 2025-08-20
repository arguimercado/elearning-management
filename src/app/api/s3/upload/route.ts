import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import {z} from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { env } from '@/lib/env';
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { S3 } from '@/lib/s3-client';

export const fileUploadSchema = z.object({
   fileName: z.string().min(1, "File name is required"),
   contentType: z.string().min(1, "Content type is required"),
   size: z.number().min(1, "File size must be greater than 0"),
   isImage: z.boolean(),
   
});

export async function POST(request: Request) {
   try {
      const body = request.json();

      const validation = fileUploadSchema.safeParse(body);

      if(!validation.success) {
         return NextResponse.json({error: "Invalid Request Body"},{status: 400});
      }

      const { fileName, contentType, size, isImage } = validation.data;
      const uniqueKey = `${uuidv4()}-${fileName}`;

      const command = new PutObjectCommand({
         Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
         ContentType: contentType,
         ContentLength: size,
         Key: uniqueKey
      });

      const presignedUrl = await getSignedUrl(S3,command, {
         expiresIn: 360, //expires in 6 minutes
      });

      const response = {
         presignedUrl,
         key: uniqueKey
      };

      return NextResponse.json(response, { status: 200 });
   }
   catch(error) {
      return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
   }
} 