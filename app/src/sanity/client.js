import { createClient } from "@sanity/client";

export const preview = createClient({
  projectId: "svms3v9p",
  dataset: "production",
  apiVersion: "2025-09-23", // today’s date or the version you want
  useCdn: false,
  fetch: {
    cache: "no-store",
  },
  token: process.env.SANITY_READ_TOKEN,
  perspective: "drafts",
});

export const production = createClient({
  projectId: "svms3v9p",
  dataset: "production",
  apiVersion: "2025-09-23", // today’s date or the version you want
  useCdn: false, // set to false if you want fresh data
});
