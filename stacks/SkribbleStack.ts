import {Api, Bucket, Config, StackContext} from "sst/constructs";

export function API({stack}: StackContext) {
    const REPLICATE_API_TOKEN = new Config.Secret(stack, "REPLICATE_API_TOKEN");

    const outputBucket = new Bucket(stack, "output", {});
    const inputBucket = new Bucket(stack, "input", {
        notifications: {
            process: {
                events: ["object_created"],
                function: {
                    functionName: "process-images",
                    handler: "packages/functions/src/process-images.handler",
                    bind: [REPLICATE_API_TOKEN, outputBucket]
                }
            },
        },
        cors: [{
            allowedMethods: ["GET", "POST"],
            allowedOrigins: ["*"],
        }],
    });

    const api = new Api(stack, "api", {
        routes: {
            "GET /api/{proxy+}": "packages/functions/src/server.handler",
        },
        cors: {
            allowMethods: ["GET"],
            allowOrigins: ["*"],
        },
    });
    api.bind([inputBucket])

    stack.addOutputs({
        ApiEndpoint: api.url,
        input: inputBucket.bucketName,
        output: outputBucket.bucketName,
    });
}
