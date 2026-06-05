import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigwIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as apigwAuthorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as budgets from "aws-cdk-lib/aws-budgets";
import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class SyncXStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const budgetEmail = this.node.tryGetContext("budgetEmail") as
      | string
      | undefined;

    const table = new dynamodb.Table(this, "SyncXTable", {
      tableName: "SyncXTable",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: "ttl",
    });

    table.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "GSI1SK", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const userPool = new cognito.UserPool(this, "SyncXUserPool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient("SyncXExtensionClient", {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: ["https://<EXTENSION_ID>.chromiumapp.org/syncx"],
      },
      generateSecret: false,
      preventUserExistenceErrors: true,
    });

    const domainPrefix = `syncx-${cdk.Names.uniqueId(this).toLowerCase().slice(0, 8)}`;
    const userPoolDomain = userPool.addDomain("SyncXDomain", {
      cognitoDomain: { domainPrefix },
    });

    const apiHandler = new lambdaNodejs.NodejsFunction(this, "SyncXApiHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "../../services/api/src/handler.ts"),
      handler: "handler",
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
      environment: {
        TABLE_NAME: table.tableName,
      },
      depsLockFilePath: path.join(__dirname, "../../pnpm-lock.yaml"),
      projectRoot: path.join(__dirname, "../.."),
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"],
        nodeModules: ["@syncx/shared"],
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    table.grantReadWriteData(apiHandler);

    const httpApi = new apigwv2.HttpApi(this, "SyncXHttpApi", {
      apiName: "syncx-api",
      corsPreflight: {
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PATCH,
          apigwv2.CorsHttpMethod.DELETE,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ["*"],
      },
    });

    const jwtAuthorizer = new apigwAuthorizers.HttpJwtAuthorizer(
      "SyncXJwtAuthorizer",
      `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: [userPoolClient.userPoolClientId],
      },
    );

    const lambdaIntegration = new apigwIntegrations.HttpLambdaIntegration(
      "SyncXLambdaIntegration",
      apiHandler,
    );

    httpApi.addRoutes({
      path: "/health",
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    httpApi.addRoutes({
      path: "/v1/{proxy+}",
      methods: [
        apigwv2.HttpMethod.GET,
        apigwv2.HttpMethod.POST,
        apigwv2.HttpMethod.PATCH,
        apigwv2.HttpMethod.DELETE,
      ],
      integration: lambdaIntegration,
      authorizer: jwtAuthorizer,
    });

    if (budgetEmail) {
      new budgets.CfnBudget(this, "SyncXMonthlyBudget", {
        budget: {
          budgetName: "syncx-monthly-budget",
          budgetLimit: { amount: 10, unit: "USD" },
          timeUnit: "MONTHLY",
          budgetType: "COST",
        },
        notificationsWithSubscribers: [
          {
            notification: {
              notificationType: "ACTUAL",
              comparisonOperator: "GREATER_THAN",
              threshold: 80,
              thresholdType: "PERCENTAGE",
            },
            subscribers: [{ subscriptionType: "EMAIL", address: budgetEmail }],
          },
          {
            notification: {
              notificationType: "ACTUAL",
              comparisonOperator: "GREATER_THAN",
              threshold: 100,
              thresholdType: "PERCENTAGE",
            },
            subscribers: [{ subscriptionType: "EMAIL", address: budgetEmail }],
          },
        ],
      });
    }

    new CfnOutput(this, "ApiUrl", {
      value: httpApi.apiEndpoint,
      description: "SyncX API base URL (set VITE_API_URL)",
    });

    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
      description: "Set VITE_COGNITO_CLIENT_ID",
    });

    new CfnOutput(this, "CognitoDomain", {
      value: `${domainPrefix}.auth.${this.region}.amazoncognito.com`,
      description: "Set VITE_COGNITO_DOMAIN",
    });

    new CfnOutput(this, "CognitoHostedUiUrl", {
      value: userPoolDomain.baseUrl(),
    });

    new CfnOutput(this, "OAuthCallbackNote", {
      value:
        "After loading the extension, copy chrome.identity.getRedirectURL('syncx') and add it to Cognito app client callback URLs via AWS Console.",
    });
  }
}
