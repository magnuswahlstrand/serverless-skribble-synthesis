import {S3EventRecord, S3Handler} from "aws-lambda";
import {Bucket} from "sst/node/bucket";
import * as console from "console";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

import {GetObjectCommand, GetObjectCommandOutput, S3Client} from "@aws-sdk/client-s3";

const s3Client = new S3Client({region: "eu-west-1"});


const replicateApiToken = '';

async function makeReplicateApiRequest(prompt: string, url: string, apiToken: string): Promise<any> {
    const version = '435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117';
    const apiUrl = 'https://api.replicate.com/v1/predictions';
    const headers = {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
        version,
        input: {
            image: url, // This can be a URL?
            prompt,
        },
    });

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body,
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
}


const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

async function downloadImageAndConvertToBase64(bucket: string, key: string): Promise<string> {
    const getObjectCommand = new GetObjectCommand({Bucket: bucket, Key: key});
    const response: GetObjectCommandOutput = await s3Client.send(getObjectCommand);

    if (!response.Body) {
        throw new Error('Failed to download the image from S3');
    }

    return await response.Body.transformToString("base64")
    // const data = await .arrayBuffer();
    // const base64 = Buffer.from(data).toString('base64');
    // return base64;
}

async function processUploadedImage(record: S3EventRecord) {
    const Key = record.s3.object.key;
    const inputBucket = record.s3.bucket.name;
    const outputBucket = Bucket.output.bucketName;

    console.log(`Processing uploaded image ${record.s3.object.key} move from ${inputBucket} to ${outputBucket}`)


    // Stream to read the file from the bucket
    // const readStream = await downloadImageAndConvertToBase64(inputBucket, Key);

    const url = await getSignedUrl(s3Client, new GetObjectCommand({Bucket: inputBucket, Key: Key}));

    const headers = {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
    };

    let prediction = await makeReplicateApiRequest(Key.replace('_', ' '), url, replicateApiToken);
    while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
        ) {
        console.log("Waiting for prediction to complete...")
        await sleep(500);
        const response = await fetch("https://api.replicate.com/v1/predictions/" + prediction.id, {headers});
        prediction = await response.json();

        if (response.status !== 200) {
            console.log("Error: " + prediction.detail)
            return;
        }
    }

    console.log(prediction)

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
