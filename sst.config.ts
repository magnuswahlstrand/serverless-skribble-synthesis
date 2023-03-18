import {SSTConfig} from "sst";
import {API} from "./stacks/SkribbleStack";

export default {
    config(_input) {
        return {
            name: "serverless-skribble-synthesis",
            region: "eu-west-1",
        };
    },
    stacks(app) {
        app.setDefaultFunctionProps({
            memorySize: 256,
            runtime: "nodejs18.x",
        })
        app.stack(API);
    }
} satisfies SSTConfig;
