import {S3Handler} from "aws-lambda";
import * as console from "console";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Config} from "sst/node/config";
import {predict} from "replicate-api";

const s3Client = new S3Client({region: "eu-west-1"});

async function sendToReplicateAI(bucket: string, filename: string) {
    console.log(`Processing uploaded image ${filename} from ${bucket}`)

    const url = await getSignedUrl(s3Client, new GetObjectCommand({Bucket: bucket, Key: filename}));

    const prediction = await predict({
        version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117", // The model name
        input: {
            image: url,
            prompt: filename.replace('_', ' '),
        },
        token: Config.REPLICATE_API_TOKEN,
        poll: true,
    })
    console.log(prediction)

    console.log('Complete!')
}

export const handler: S3Handler = async (event) => {
    console.log(`Received ${event.Records.length} records`);
    const processingPromises = event.Records.map(async (record) => {
        const bucket = record.s3.bucket.name;
        const filename = record.s3.object.key
        await sendToReplicateAI(bucket, filename);
    });

    await Promise.all(processingPromises);
}
