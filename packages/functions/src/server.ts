// @filename: server.ts
import {initTRPC} from '@trpc/server';
import {awsLambdaRequestHandler} from '@trpc/server/adapters/aws-lambda';
import KSUID from "ksuid";

import {z} from 'zod';
import {generatePresignedUrlAndFormFields} from "./s3";

interface User {
    id: string;
    name: string;
}

export const t = initTRPC.create();
const appRouter = t.router({
        getUploadUrl: t.procedure
            .input(z.string())
            .query((req) => {
                const id = KSUID.randomSync().string;
                return generatePresignedUrlAndFormFields(id, req.input);
            }),
        getImage: t.procedure
            .input(z.object({name: z.string()}))
            .mutation((req) => {
                const user: User = {
                    id: `${Math.random()}`,
                    name: req.input.name,
                };

                return user;
            }),
    })
;
// export type definition of API
export type AppRouter = typeof appRouter;

export const handler = awsLambdaRequestHandler({router: appRouter})