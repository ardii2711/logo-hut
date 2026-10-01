import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_API_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export async function uploadFile(
  path: string,
  buffer: Buffer,
  mimetype: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    Body: buffer,
    ContentType: mimetype,
  });

  await r2Client.send(command);
  return path;
}

export async function deleteFile(path: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await r2Client.send(command);
}

export async function deleteFiles(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  
  const command = new DeleteObjectsCommand({
    Bucket: BUCKET_NAME,
    Delete: {
      Objects: paths.map(Key => ({ Key })),
    },
  });

  await r2Client.send(command);
}

export function getPublicUrl(path: string): string {
  return `${PUBLIC_URL}/${path}`;
}
