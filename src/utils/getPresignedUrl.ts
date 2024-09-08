import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const getPresignedUrl = async () => {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: crypto.randomUUID(),
    Bucket: process.env.S3_BUCKET,
  });

  const url = await getSignedUrl(
    new S3Client({
      region: "us-east-1",
    }),
    command,
  );

  return url;
};
