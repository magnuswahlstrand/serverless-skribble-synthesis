import {Bucket, StackContext} from "sst/constructs";

export function API({stack}: StackContext) {
    const outputBucket = new Bucket(stack, "output", {});
    const inputBucket = new Bucket(stack, "input", {
        notifications: {
            process: {
                events: ["object_created"],
                function: {
                    functionName: "process-images",
                    handler: "packages/functions/src/process-images.handler",
                    bind: [outputBucket]
                }
            },
        }
    });

    stack.addOutputs({
        input: inputBucket.bucketName,
        output: outputBucket.bucketName,
    });
}
