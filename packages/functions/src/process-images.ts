import {S3EventRecord, S3Handler} from "aws-lambda";
import stream from "stream";
import {Bucket} from "sst/node/bucket";
import * as console from "console";
import { Upload } from "@aws-sdk/lib-storage";

import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
const s3Client = new S3Client({region: "eu-west-1"});


type S3Bucket = {
    Bucket: string;
    Key: string;
}

// Read stream for downloading from S3
async function readStreamFromS3(bucket: S3Bucket) {
    const getObjectCommand = new GetObjectCommand({
        Key: bucket.Key,
        Bucket: bucket.Bucket,
    });

    const data = await s3Client.send(getObjectCommand);
    return data.Body;
}

// Write stream for uploading to S3
function writeStreamToS3(bucket: S3Bucket) {
    const pass = new stream.PassThrough();

    const upload = async () => {
        const putObjectCommand = new PutObjectCommand({
            Key: bucket.Key,
            Bucket: bucket.Bucket,
            Body: pass,
        });

        await s3Client.send(putObjectCommand);
    };

    return {
        writeStream: pass,
        upload: upload(),
    };
}

async function processUploadedImage(record: S3EventRecord) {
    const Key = record.s3.object.key;
    const inputBucket = record.s3.bucket.name;
    const outputBucket = Bucket.output.bucketName;

    console.log(`Processing uploaded image ${record.s3.object.key} move from ${inputBucket} to ${outputBucket}`)


    // Stream to read the file from the bucket
    const readStream = await readStreamFromS3({
        Bucket: inputBucket,
        Key
    });

    // https://stackoverflow.com/questions/69884898/how-to-upload-a-stream-to-s3-with-aws-sdk-v3
    const parallelUploads3 = new Upload({
        client: s3Client,
        leavePartsOnError: false, // optional manually handle dropped parts
        params: {
            Bucket: outputBucket,
            Key,
            Body: readStream
        },
    })

    parallelUploads3.on("httpUploadProgress", (progress: any) => {
        console.log(progress);
    });

    await parallelUploads3.done();

// // Stream to upload to the bucket
// const {writeStream, upload} = writeStreamToS3({
//     Bucket: outputBucket,
//     Key,
// });
    console.log('Complete!')

// Trigger the streams

// Wait for the file to upload
// await upload;
}

export const handler: S3Handler = async (event) => {
    console.log(`Received ${event.Records.length} records`);
    const processingPromises = event.Records.map(async (record) => {
        await processUploadedImage(record);
    });

    await Promise.all(processingPromises);
}


// export const handler = S3Handler(async (_evt) => {
//
//     return {
//         body: `Hello world. The time is ${Time.now()}`,
//     };
// });
