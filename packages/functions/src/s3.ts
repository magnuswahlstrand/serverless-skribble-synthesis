import {Bucket} from "sst/node/bucket";
import {createPresignedPost} from "@aws-sdk/s3-presigned-post";
import {GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({region: "eu-west-1"});

// Create a function that generates a presigned URL and returns the URL and any required form fields
export async function generatePresignedUrlAndFormFields(fileId: string, prompt: string): Promise<{ url: string, fields: { [key: string]: string }, id: string }> {
    // Specify the S3 bucket and object key that the file will be uploaded to
    const bucketName = Bucket.input.bucketName;
    console.log(fileId);
    console.log(typeof fileId);


    const {url, fields} = await createPresignedPost(s3Client, {
        Bucket: bucketName,
        Key: fileId + ".png",
        Expires: 15 * 60,
        Fields: {
            'x-amz-meta-pdf-type': "some type",
            'x-amz-meta-prompt': prompt,
            'x-amz-meta-pdf-id': "id",
        }
    });

    return {url, fields, id: fileId};
}

export async function generateSignedUrlGet(bucket: string, filename: string) {
    return getSignedUrl(s3Client,
        new GetObjectCommand({Bucket: bucket, Key: filename})
    )
}

export async function getMetadata(bucket: string, filename: string) {
    return await s3Client.send(new HeadObjectCommand({Bucket: bucket, Key: filename}))
}

export async function uploadFile(bucket: string, filename: string, body: Readable) {
    return s3Client.send(new PutObjectCommand({Bucket: bucket, Key: filename, Body: body}))
}
