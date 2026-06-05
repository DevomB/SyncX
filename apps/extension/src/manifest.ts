import type { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "SyncX",
  version: "0.1.0",
  description: "Search mirror queue — replays Google queries on Bing with enforced pacing.",
  permissions: ["storage", "alarms", "notifications", "identity", "tabs"],
  host_permissions: [
    "https://www.google.com/*",
    "https://www.bing.com/*",
  ],
  optional_host_permissions: [
    "https://*.execute-api.*.amazonaws.com/*",
    "https://*.amazoncognito.com/*",
  ],
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  action: {
    default_popup: "popup.html",
    default_title: "SyncX",
  },
  icons: {
    "128": "icon-128.png",
  },
  options_page: "options.html",
  content_scripts: [
    {
      matches: ["https://www.google.com/search*"],
      js: ["src/content/googleCapture.ts"],
      run_at: "document_idle",
    },
    {
      matches: ["https://www.bing.com/search*"],
      js: ["src/content/bingThrottle.ts"],
      run_at: "document_idle",
    },
  ],
};

export default manifest;
