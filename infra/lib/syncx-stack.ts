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
import * as resourcegroups from "aws-cdk-lib/aws-resourcegroups";
import {
  Application,
  AttributeGroup,
} from "@aws-cdk/aws-servicecatalogappregistry-alpha";
import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

const APPLICATION_NAME = "syncx-prod";

export class SyncXStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add("Application", APPLICATION_NAME);
    cdk.Tags.of(this).add("Project", "SyncX");
    cdk.Tags.of(this).add("Environment", "prod");

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
      projectRoot: path.join(__dirname, "../.."),
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: [],
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    table.grantReadWriteData(apiHandler);

    const httpApi = new apigwv2.HttpApi(this, "SyncXHttpApi", {
      apiName: "syncx-api",
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

    new CfnOutput(this, "ExtensionConfigJson", {
      value: JSON.stringify({
        apiUrl: httpApi.apiEndpoint,
        cognitoDomain: `${domainPrefix}.auth.${this.region}.amazoncognito.com`,
        cognitoClientId: userPoolClient.userPoolClientId,
      }),
      description:
        "Paste these three values into SyncX Settings → Your cloud backend",
    });

    new CfnOutput(this, "ApiUrl", {
      value: httpApi.apiEndpoint,
      description: "SyncX API base URL",
    });

    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
      description: "Cognito app client ID for extension settings",
    });

    new CfnOutput(this, "CognitoDomain", {
      value: `${domainPrefix}.auth.${this.region}.amazoncognito.com`,
      description: "Cognito hosted UI domain (host only)",
    });

    new CfnOutput(this, "CognitoHostedUiUrl", {
      value: userPoolDomain.baseUrl(),
    });

    new CfnOutput(this, "OAuthCallbackNote", {
      value:
        "After loading the extension, copy chrome.identity.getRedirectURL('syncx') and add it to Cognito app client callback URLs via AWS Console.",
    });

    const application = new Application(this, "SyncXAppRegistryApplication", {
      applicationName: APPLICATION_NAME,
      description:
        "SyncX production cloud backend. API Gateway Lambda DynamoDB Cognito.",
    });

    application.associateApplicationWithStack(this);

    const attributeGroup = new AttributeGroup(this, "SyncXAttributeGroup", {
      attributeGroupName: "syncx-prod-attributes",
      description: "SyncX production application metadata",
      attributes: {
        project: "SyncX",
        environment: "prod",
        component: "cloud-backend",
      },
    });

    attributeGroup.associateWith(application);

    new resourcegroups.CfnGroup(this, "SyncXResourceGroup", {
      name: APPLICATION_NAME,
      description:
        "SyncX production resources for myApplications and Resource Groups",
      resourceQuery: {
        type: "TAG_FILTERS_1_0",
        query: {
          resourceTypeFilters: ["AWS::AllSupported"],
          tagFilters: [
            {
              key: "Application",
              values: [APPLICATION_NAME],
            },
          ],
        },
      },
    });

    new CfnOutput(this, "ApplicationName", {
      value: APPLICATION_NAME,
      description: "myApplications / AppRegistry application name",
    });

    new CfnOutput(this, "ApplicationArn", {
      value: application.applicationArn,
      description: "AppRegistry application ARN (awsApplication tag on resources)",
    });

    new CfnOutput(this, "ResourceGroupName", {
      value: APPLICATION_NAME,
      description: "AWS Resource Groups name for console filtering",
    });
  }
}
