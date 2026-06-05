#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SyncXStack } from "../lib/syncx-stack";

const app = new cdk.App();

new SyncXStack(app, "SyncXStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  },
});
