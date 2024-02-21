"use server";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Bucket } from "sst/node/bucket";

export const uploadFile = async (file: File, type: string) => {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: crypto.randomUUID(),
    Bucket: Bucket.public.bucketName,
  });
  const url = await getSignedUrl(new S3Client({}), command);
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${file.name}"`,
    },
    body: file,
  });
};
