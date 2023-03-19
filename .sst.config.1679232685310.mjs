import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/SkribbleStack.ts
import { Api, Bucket, Config } from "sst/constructs";
function API({ stack }) {
  const REPLICATE_API_TOKEN = new Config.Secret(stack, "REPLICATE_API_TOKEN");
  const outputBucket = new Bucket(stack, "output", {});
  const inputBucket = new Bucket(stack, "input", {
    notifications: {
      process: {
        events: ["object_created"],
        function: {
          functionName: "process-images",
          handler: "packages/functions/src/process-images.handler",
          bind: [REPLICATE_API_TOKEN]
        }
      }
    },
    cors: [{
      allowedMethods: ["GET", "POST"],
      allowedOrigins: ["*"]
    }]
  });
  const api = new Api(stack, "api", {
    routes: {
      "GET /api/{proxy+}": "packages/functions/src/server.handler"
    },
    cors: {
      allowMethods: ["GET"],
      allowOrigins: ["*"]
    }
  });
  api.bind([inputBucket]);
  stack.addOutputs({
    ApiEndpoint: api.url,
    input: inputBucket.bucketName,
    output: outputBucket.bucketName
  });
}
__name(API, "API");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "serverless-skribble-synthesis",
      region: "eu-west-1"
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      memorySize: 256,
      runtime: "nodejs18.x"
    });
    app.stack(API);
  }
};
export {
  sst_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3RhY2tzL1NrcmliYmxlU3RhY2sudHMiLCAic3N0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtBcGksIEJ1Y2tldCwgQ29uZmlnLCBTdGFja0NvbnRleHR9IGZyb20gXCJzc3QvY29uc3RydWN0c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gQVBJKHtzdGFja306IFN0YWNrQ29udGV4dCkge1xuICAgIGNvbnN0IFJFUExJQ0FURV9BUElfVE9LRU4gPSBuZXcgQ29uZmlnLlNlY3JldChzdGFjaywgXCJSRVBMSUNBVEVfQVBJX1RPS0VOXCIpO1xuXG4gICAgY29uc3Qgb3V0cHV0QnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjaywgXCJvdXRwdXRcIiwge30pO1xuICAgIGNvbnN0IGlucHV0QnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjaywgXCJpbnB1dFwiLCB7XG4gICAgICAgIG5vdGlmaWNhdGlvbnM6IHtcbiAgICAgICAgICAgIHByb2Nlc3M6IHtcbiAgICAgICAgICAgICAgICBldmVudHM6IFtcIm9iamVjdF9jcmVhdGVkXCJdLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogXCJwcm9jZXNzLWltYWdlc1wiLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBcInBhY2thZ2VzL2Z1bmN0aW9ucy9zcmMvcHJvY2Vzcy1pbWFnZXMuaGFuZGxlclwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbUkVQTElDQVRFX0FQSV9UT0tFTl1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBjb3JzOiBbe1xuICAgICAgICAgICAgYWxsb3dlZE1ldGhvZHM6IFtcIkdFVFwiLCBcIlBPU1RcIl0sXG4gICAgICAgICAgICBhbGxvd2VkT3JpZ2luczogW1wiKlwiXSxcbiAgICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgQXBpKHN0YWNrLCBcImFwaVwiLCB7XG4gICAgICAgIHJvdXRlczoge1xuICAgICAgICAgICAgXCJHRVQgL2FwaS97cHJveHkrfVwiOiBcInBhY2thZ2VzL2Z1bmN0aW9ucy9zcmMvc2VydmVyLmhhbmRsZXJcIixcbiAgICAgICAgfSxcbiAgICAgICAgY29yczoge1xuICAgICAgICAgICAgYWxsb3dNZXRob2RzOiBbXCJHRVRcIl0sXG4gICAgICAgICAgICBhbGxvd09yaWdpbnM6IFtcIipcIl0sXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgYXBpLmJpbmQoW2lucHV0QnVja2V0XSlcblxuICAgIHN0YWNrLmFkZE91dHB1dHMoe1xuICAgICAgICBBcGlFbmRwb2ludDogYXBpLnVybCxcbiAgICAgICAgaW5wdXQ6IGlucHV0QnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIG91dHB1dDogb3V0cHV0QnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgfSk7XG59XG4iLCAiaW1wb3J0IHtTU1RDb25maWd9IGZyb20gXCJzc3RcIjtcbmltcG9ydCB7QVBJfSBmcm9tIFwiLi9zdGFja3MvU2tyaWJibGVTdGFja1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnKF9pbnB1dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogXCJzZXJ2ZXJsZXNzLXNrcmliYmxlLXN5bnRoZXNpc1wiLFxuICAgICAgICAgICAgcmVnaW9uOiBcImV1LXdlc3QtMVwiLFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgc3RhY2tzKGFwcCkge1xuICAgICAgICBhcHAuc2V0RGVmYXVsdEZ1bmN0aW9uUHJvcHMoe1xuICAgICAgICAgICAgbWVtb3J5U2l6ZTogMjU2LFxuICAgICAgICAgICAgcnVudGltZTogXCJub2RlanMxOC54XCIsXG4gICAgICAgIH0pXG4gICAgICAgIGFwcC5zdGFjayhBUEkpO1xuICAgIH1cbn0gc2F0aXNmaWVzIFNTVENvbmZpZztcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7O0FBQUEsU0FBUSxLQUFLLFFBQVEsY0FBMkI7QUFFekMsU0FBUyxJQUFJLEVBQUMsTUFBSyxHQUFpQjtBQUN2QyxRQUFNLHNCQUFzQixJQUFJLE9BQU8sT0FBTyxPQUFPLHFCQUFxQjtBQUUxRSxRQUFNLGVBQWUsSUFBSSxPQUFPLE9BQU8sVUFBVSxDQUFDLENBQUM7QUFDbkQsUUFBTSxjQUFjLElBQUksT0FBTyxPQUFPLFNBQVM7QUFBQSxJQUMzQyxlQUFlO0FBQUEsTUFDWCxTQUFTO0FBQUEsUUFDTCxRQUFRLENBQUMsZ0JBQWdCO0FBQUEsUUFDekIsVUFBVTtBQUFBLFVBQ04sY0FBYztBQUFBLFVBQ2QsU0FBUztBQUFBLFVBQ1QsTUFBTSxDQUFDLG1CQUFtQjtBQUFBLFFBQzlCO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBLE1BQU0sQ0FBQztBQUFBLE1BQ0gsZ0JBQWdCLENBQUMsT0FBTyxNQUFNO0FBQUEsTUFDOUIsZ0JBQWdCLENBQUMsR0FBRztBQUFBLElBQ3hCLENBQUM7QUFBQSxFQUNMLENBQUM7QUFFRCxRQUFNLE1BQU0sSUFBSSxJQUFJLE9BQU8sT0FBTztBQUFBLElBQzlCLFFBQVE7QUFBQSxNQUNKLHFCQUFxQjtBQUFBLElBQ3pCO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDRixjQUFjLENBQUMsS0FBSztBQUFBLE1BQ3BCLGNBQWMsQ0FBQyxHQUFHO0FBQUEsSUFDdEI7QUFBQSxFQUNKLENBQUM7QUFDRCxNQUFJLEtBQUssQ0FBQyxXQUFXLENBQUM7QUFFdEIsUUFBTSxXQUFXO0FBQUEsSUFDYixhQUFhLElBQUk7QUFBQSxJQUNqQixPQUFPLFlBQVk7QUFBQSxJQUNuQixRQUFRLGFBQWE7QUFBQSxFQUN6QixDQUFDO0FBQ0w7QUFyQ2dCOzs7QUNDaEIsSUFBTyxxQkFBUTtBQUFBLEVBQ1gsT0FBTyxRQUFRO0FBQ1gsV0FBTztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1o7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPLEtBQUs7QUFDUixRQUFJLHdCQUF3QjtBQUFBLE1BQ3hCLFlBQVk7QUFBQSxNQUNaLFNBQVM7QUFBQSxJQUNiLENBQUM7QUFDRCxRQUFJLE1BQU0sR0FBRztBQUFBLEVBQ2pCO0FBQ0o7IiwKICAibmFtZXMiOiBbXQp9Cg==
