import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import {
  DEFAULT_USER_SETTINGS,
  MAX_QUERY_LENGTH,
  MIN_QUERY_LENGTH,
  type CompleteQueueBody,
  type PostSearchBody,
  type QueueItem,
  type ReplayStats,
  type UserSettings,
} from "@syncx/shared";

const TABLE_NAME = process.env.TABLE_NAME ?? "SyncXTable";
const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

function jsonResponse(
  statusCode: number,
  body?: unknown,
): APIGatewayProxyResultV2 {
  if (body === undefined) {
    return { statusCode };
  }
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function userPk(sub: string): string {
  return `USER#${sub}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function padCreatedAt(iso: string): string {
  return iso.padStart(30, "0");
}

function getSub(event: APIGatewayProxyEventV2): string | null {
  const ctx = event.requestContext as APIGatewayProxyEventV2["requestContext"] & {
    authorizer?: { jwt?: { claims?: Record<string, unknown> } };
  };
  const sub = ctx.authorizer?.jwt?.claims?.sub;
  return typeof sub === "string" ? sub : null;
}

function parseBody<T>(event: APIGatewayProxyEventV2): T | null {
  if (!event.body) {
    return null;
  }
  try {
    return JSON.parse(event.body) as T;
  } catch {
    return null;
  }
}

async function getSettings(sub: string): Promise<UserSettings> {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": userPk(sub),
        ":sk": "SETTINGS",
      },
    }),
  );
  const item = result.Items?.[0];
  if (!item) {
    return { ...DEFAULT_USER_SETTINGS };
  }
  return {
    paused: Boolean(item.paused),
    maxReplaysPerDay: Number(item.maxReplaysPerDay),
    minDelayMs: Number(item.minDelayMs),
    maxDelayMs: Number(item.maxDelayMs),
    activeStartHour: Number(item.activeStartHour),
    activeEndHour: Number(item.activeEndHour),
    dedupWindowMs: Number(item.dedupWindowMs),
  };
}

async function putSettings(sub: string, settings: UserSettings): Promise<void> {
  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: userPk(sub),
        SK: "SETTINGS",
        ...settings,
      },
    }),
  );
}

async function countPending(sub: string): Promise<number> {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": userPk(sub),
        ":prefix": "pending#",
      },
      Select: "COUNT",
    }),
  );
  return result.Count ?? 0;
}
async function getStats(sub: string): Promise<ReplayStats> {
  const date = todayDateString();
  const result = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": userPk(sub),
        ":sk": `STAT#${date}`,
      },
    }),
  );
  const item = result.Items?.[0];
  const pendingCount = await countPending(sub);
  return {
    date,
    replayCount: Number(item?.replayCount ?? 0),
    skippedCount: Number(item?.skippedCount ?? 0),
    pendingCount,
  };
}

async function incrementStat(
  sub: string,
  field: "replayCount" | "skippedCount",
): Promise<void> {
  const date = todayDateString();
  await client.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: userPk(sub), SK: `STAT#${date}` },
      UpdateExpression:
        "SET #date = if_not_exists(#date, :date), #field = if_not_exists(#field, :zero) + :inc",
      ExpressionAttributeNames: {
        "#date": "date",
        "#field": field,
      },
      ExpressionAttributeValues: {
        ":date": date,
        ":zero": 0,
        ":inc": 1,
      },
    }),
  );
}

async function postSearch(
  sub: string,
  body: PostSearchBody,
): Promise<APIGatewayProxyResultV2> {
  const query = body.query?.trim() ?? "";
  if (query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) {
    return jsonResponse(400, { error: "invalid_query_length" });
  }

  const eventId = generateId();
  const queueId = generateId();
  const createdAt = body.capturedAt ?? new Date().toISOString();
  const ttl = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: userPk(sub),
        SK: `EVENT#${createdAt}#${eventId}`,
        query,
        sourceUrl: body.sourceUrl ?? "",
        createdAt,
        ttl,
      },
    }),
  );

  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: userPk(sub),
        SK: `QUEUE#${createdAt}#${queueId}`,
        id: queueId,
        query,
        status: "pending",
        createdAt: new Date(createdAt).getTime(),
        GSI1PK: userPk(sub),
        GSI1SK: `pending#${padCreatedAt(createdAt)}#${queueId}`,
      },
    }),
  );

  return jsonResponse(201, { eventId, queueId });
}

async function getPending(sub: string): Promise<APIGatewayProxyResultV2> {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": userPk(sub),
        ":prefix": "pending#",
      },
      Limit: 1,
      ScanIndexForward: true,
    }),
  );

  const item = result.Items?.[0];
  if (!item) {
    return jsonResponse(204);
  }

  const queueId = item.id as string;
  const pk = item.PK as string;
  const sk = item.SK as string;
  const lockedAt = new Date().toISOString();

  await client.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression:
        "SET #status = :replaying, lockedAt = :lockedAt REMOVE GSI1PK, GSI1SK",
      ConditionExpression: "#status = :pending",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":replaying": "replaying",
        ":pending": "pending",
        ":lockedAt": lockedAt,
      },
    }),
  );

  const queueItem: QueueItem = {
    id: queueId,
    query: item.query as string,
    status: "replaying",
    createdAt: Number(item.createdAt),
  };

  return jsonResponse(200, queueItem);
}

async function completeQueue(
  sub: string,
  queueId: string,
  body: CompleteQueueBody,
): Promise<APIGatewayProxyResultV2> {
  const result = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      FilterExpression: "id = :id AND #status = :replaying",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":pk": userPk(sub),
        ":prefix": "QUEUE#",
        ":id": queueId,
        ":replaying": "replaying",
      },
    }),
  );

  const item = result.Items?.[0];
  if (!item) {
    return jsonResponse(404, { error: "queue_item_not_found" });
  }

  const finalStatus = body.status === "skipped" ? "skipped" : "done";

  await client.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: item.PK, SK: item.SK },
      UpdateExpression:
        "SET #status = :status, replayedAt = :now, failReason = :reason",
      ConditionExpression: "#status = :replaying",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": finalStatus,
        ":replaying": "replaying",
        ":now": Date.now(),
        ":reason": body.failReason ?? null,
      },
    }),
  );

  if (body.status === "skipped") {
    await incrementStat(sub, "skippedCount");
  } else {
    await incrementStat(sub, "replayCount");
  }

  return jsonResponse(200, { ok: true });
}

function validateSettingsPatch(
  patch: Partial<UserSettings>,
): Partial<UserSettings> | null {
  const validated: Partial<UserSettings> = {};

  if (patch.paused !== undefined) {
    validated.paused = Boolean(patch.paused);
  }
  if (patch.maxReplaysPerDay !== undefined) {
    const v = Number(patch.maxReplaysPerDay);
    if (v < 1 || v > 30) return null;
    validated.maxReplaysPerDay = v;
  }
  if (patch.minDelayMs !== undefined) {
    validated.minDelayMs = Number(patch.minDelayMs);
  }
  if (patch.maxDelayMs !== undefined) {
    validated.maxDelayMs = Number(patch.maxDelayMs);
  }
  if (patch.activeStartHour !== undefined) {
    const v = Number(patch.activeStartHour);
    if (v < 0 || v > 23) return null;
    validated.activeStartHour = v;
  }
  if (patch.activeEndHour !== undefined) {
    const v = Number(patch.activeEndHour);
    if (v < 0 || v > 23) return null;
    validated.activeEndHour = v;
  }
  if (patch.dedupWindowMs !== undefined) {
    validated.dedupWindowMs = Number(patch.dedupWindowMs);
  }

  const min = validated.minDelayMs;
  const max = validated.maxDelayMs;
  if (min !== undefined && max !== undefined && min > max) {
    return null;
  }

  return validated;
}

async function deleteUser(sub: string): Promise<APIGatewayProxyResultV2> {
  let lastKey: Record<string, unknown> | undefined;

  do {
    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { ":pk": userPk(sub) },
        ExclusiveStartKey: lastKey,
      }),
    );

    const items = result.Items ?? [];
    if (items.length > 0) {
      const batches = [];
      for (let i = 0; i < items.length; i += 25) {
        batches.push(items.slice(i, i + 25));
      }
      for (const batch of batches) {
        await client.send(
          new BatchWriteCommand({
            RequestItems: {
              [TABLE_NAME]: batch.map((item) => ({
                DeleteRequest: {
                  Key: { PK: item.PK, SK: item.SK },
                },
              })),
            },
          }),
        );
      }
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return jsonResponse(204);
}

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  if (method === "GET" && path === "/health") {
    return jsonResponse(200, { ok: true });
  }

  const sub = getSub(event);
  if (!sub) {
    return jsonResponse(401, { error: "unauthorized" });
  }

  try {
    if (method === "POST" && path === "/v1/events/search") {
      const body = parseBody<PostSearchBody>(event);
      if (!body?.query) {
        return jsonResponse(400, { error: "missing_query" });
      }
      return postSearch(sub, body);
    }

    if (method === "GET" && path === "/v1/queue/pending") {
      return getPending(sub);
    }

    const completeMatch = path.match(/^\/v1\/queue\/([^/]+)\/complete$/);
    if (method === "POST" && completeMatch) {
      const body = parseBody<CompleteQueueBody>(event);
      if (!body?.status) {
        return jsonResponse(400, { error: "missing_status" });
      }
      return completeQueue(sub, decodeURIComponent(completeMatch[1]), body);
    }

    if (method === "GET" && path === "/v1/stats/today") {
      return jsonResponse(200, await getStats(sub));
    }

    if (method === "GET" && path === "/v1/settings") {
      return jsonResponse(200, await getSettings(sub));
    }

    if (method === "PATCH" && path === "/v1/settings") {
      const body = parseBody<Partial<UserSettings>>(event);
      if (!body) {
        return jsonResponse(400, { error: "invalid_body" });
      }
      const validated = validateSettingsPatch(body);
      if (!validated) {
        return jsonResponse(400, { error: "invalid_settings" });
      }
      const current = await getSettings(sub);
      const merged = { ...current, ...validated };
      if (merged.minDelayMs > merged.maxDelayMs) {
        return jsonResponse(400, { error: "min_delay_exceeds_max" });
      }
      await putSettings(sub, merged);
      return jsonResponse(200, merged);
    }

    if (method === "DELETE" && path === "/v1/user") {
      return deleteUser(sub);
    }

    return jsonResponse(404, { error: "not_found" });
  } catch (error) {
    console.error(error);
    return jsonResponse(500, { error: "internal_error" });
  }
}
