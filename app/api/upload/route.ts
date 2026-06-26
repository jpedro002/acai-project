import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { ADMIN_SESSION_COOKIE_NAME } from '@/lib/auth/session';

// Only admins may mint presigned upload URLs for the catalog bucket.
async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error('Unauthorized');

  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
  const role = userDoc.data()?.role;
  if (role !== 'admin' && decoded.admin !== true) {
    throw new Error('Unauthorized');
  }
  return decoded;
}

const getR2Config = () => {
  const accountId = (process.env.R2_ACCOUNT_ID ?? '').trim();
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID ?? '').trim();
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY ?? '').trim();
  const bucketName = (process.env.R2_BUCKET_NAME ?? '').trim();
  const publicUrl = (process.env.R2_PUBLIC_URL ?? '').trim();

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
};

export async function POST(request: Request) {
  try {
    try {
      await verifyAdmin();
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl: publicBaseUrl } = getR2Config();

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicBaseUrl) {
      return NextResponse.json(
        { error: 'Variaveis R2 ausentes. Configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME e R2_PUBLIC_URL.' },
        { status: 500 }
      );
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Filename and contentType are required' }, { status: 400 });
    }

    const uniqueId = Math.random().toString(36).substring(2, 15);
    const key = `catalog/${Date.now()}-${uniqueId}-${filename}`;

    // Fail early with a clear message when keys are invalid or bucket policy blocks the key.
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (error) {
      console.error('R2 auth/bucket check failed:', error);
      const statusCode =
        typeof error === 'object' && error !== null && '$metadata' in error
          ? (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
          : undefined;
      return NextResponse.json(
        {
          error:
            statusCode === 401
              ? 'R2 retornou 401. Access Key/Secret invalidos ou revogados para este Account ID.'
              : 'Credenciais R2 invalidas ou sem permissao no bucket.',
        },
        { status: 401 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicBase = publicBaseUrl.replace(/\/+$/, '');
    const publicUrl = `${publicBase}/${key}`;

    return NextResponse.json({ presignedUrl, publicUrl, key });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 });
  }
}
