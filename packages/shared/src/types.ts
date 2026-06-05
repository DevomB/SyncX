export type SearchSource = "google";

export interface SearchEvent {
  id: string;
  query: string;
  capturedAt: number;
  source: SearchSource;
  sourceUrl: string;
}

export type QueueItemStatus = "pending" | "replaying" | "done" | "skipped";

export interface QueueItem {
  id: string;
  query: string;
  status: QueueItemStatus;
  createdAt: number;
  replayedAt?: number;
  failReason?: string;
}

export interface UserSettings {
  paused: boolean;
  maxReplaysPerDay: number;
  minDelayMs: number;
  maxDelayMs: number;
  activeStartHour: number;
  activeEndHour: number;
  dedupWindowMs: number;
}

export interface ReplayStats {
  date: string;
  replayCount: number;
  skippedCount: number;
  pendingCount?: number;
}

export interface CaptureSearchMessage {
  type: "CAPTURE_SEARCH";
  query: string;
  sourceUrl: string;
  capturedAt: number;
}

export interface ThrottleDetectedMessage {
  type: "THROTTLE_DETECTED";
}

export type BackgroundMessage =
  | CaptureSearchMessage
  | ThrottleDetectedMessage
  | { type: "GET_STATUS" }
  | { type: "SET_PAUSED"; paused: boolean }
  | { type: "FORCE_REPLAY_NOW" };

export interface ExtensionStatus {
  pendingCount: number;
  todayReplays: number;
  maxReplaysPerDay: number;
  paused: boolean;
  msLoggedIn: boolean;
  cloudConnected: boolean;
}

export interface PostSearchBody {
  query: string;
  capturedAt: string;
  sourceUrl?: string;
}

export interface CompleteQueueBody {
  status: "done" | "skipped";
  failReason?: string;
}
