import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { getCurrentUser, requireAdminAccess } from "@/lib/data/admin/user-session";
import { env } from "@/lib/env";
import { S3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";



const aj = arcjet
   .withRule(
      detectBot({
         mode: 'LIVE',
         allow: []
      })
   ).withRule(
      fixedWindow({
         mode: 'LIVE',
         window: "1m",
         max: 5
      })
   )

export async function DELETE(request: Request) {
   
   const session = await requireAdminAccess();

   try {

      const decision = await aj.protect(request, { fingerprint: session.id });
      if (decision.isDenied()) {
         return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }

      const body = await request.json();
      console.log("Deleting file:", body);
      const { key } = body;
      console.log("Key to delete:", key);
      if (!key) {
         return NextResponse.json({ error: "Missing key" }, { status: 400 });
      }

      const command = new DeleteObjectCommand({
         Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
         Key: key,
      });


      await S3.send(command);

      return NextResponse.json({ message: "File deleted" }, { status: 200 });
   } catch (error) {
      console.log("error", error);
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
   }
}