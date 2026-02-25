import * as gcp from "@pulumi/gcp";

export const bucket = new gcp.storage.Bucket("test-bucket", {
  location: "ASIA-SOUTHEAST1",
});