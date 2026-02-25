/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cloud-engineer-gce",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "local", // store state locally
      providers: {
        gcp: {
          project: "voltarocks-42-sandbox",
          region: "asia-southeast1",
          zone: "asia-southeast1-a",
        },
      },
    };
  },

  async run() {
    const gcp = await import("@pulumi/gcp");

    // existing service account (used by VM)
    const vmSaEmail =
      "github-actions-deploy@voltarocks-42-sandbox.iam.gserviceaccount.com";

    // allow pulling image from Artifact Registry
    new gcp.projects.IAMMember("artifact-pull-access", {
      project: "voltarocks-42-sandbox",
      role: "roles/artifactregistry.reader",
      member: `serviceAccount:${vmSaEmail}`,
    });

    // open port 80 for web traffic
    new gcp.compute.Firewall("allow-http", {
      network: "default",
      allows: [{ protocol: "tcp", ports: ["80"] }],
      sourceRanges: ["0.0.0.0/0"],
      targetTags: ["web-server"], // apply only to tagged VMs
    });

    // allow SSH via IAP
    new gcp.compute.Firewall("allow-iap-ssh", {
      network: "default",
      allows: [{ protocol: "tcp", ports: ["22"] }],
      sourceRanges: ["35.235.240.0/20"],
    });

    // create VM
    const vm = new gcp.compute.Instance("cloud-engineer-vm", {
      zone: "asia-southeast1-a",
      machineType: "e2-micro",
      tags: ["web-server"], // match firewall tag

      bootDisk: {
        initializeParams: {
          image: "debian-cloud/debian-12",
        },
      },

      networkInterfaces: [
        {
          network: "default",
          accessConfigs: [{}], // assign public IP
        },
      ],

      // attach service account
      serviceAccount: {
        email: vmSaEmail,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      },

      // install docker + init swarm
      metadataStartupScript: `#!/bin/bash
        apt-get update
        apt-get install -y docker.io
        systemctl enable docker
        systemctl start docker
        docker swarm init || true
      `,
    });

    return {
      vmName: vm.name,
      externalIP: vm.networkInterfaces.apply(
        (ni) => ni[0]?.accessConfigs?.[0]?.natIp
      ),
    };
  },
});