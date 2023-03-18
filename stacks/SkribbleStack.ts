import {Bucket, Config, StackContext} from "sst/constructs";

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
                    bind: [outputBucket, REPLICATE_API_TOKEN]
                }
            },
        }
    });

    stack.addOutputs({
        input: inputBucket.bucketName,
        output: outputBucket.bucketName,
    });
}
