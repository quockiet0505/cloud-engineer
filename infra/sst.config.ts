/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cloud-engineer-gce",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "local",
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

    //  Create new runtime service account for VM
    const vmRuntimeSa = new gcp.serviceaccount.Account("vm-runtime-sa", {
      accountId: "vm-runtime-sa",
      displayName: "VM Runtime Service Account",
    });

    //  Grant ONLY pull permission to VM SA
    new gcp.projects.IAMMember("vm-artifact-reader", {
      project: "voltarocks-42-sandbox",
      role: "roles/artifactregistry.reader",
      member: vmRuntimeSa.email.apply(
        (email) => `serviceAccount:${email}`
      ),
    });

    //  Firewall HTTP
    new gcp.compute.Firewall("allow-http", {
      network: "default",
      allows: [{ protocol: "tcp", ports: ["80"] }],
      sourceRanges: ["0.0.0.0/0"],
      targetTags: ["web-server"],
    });

    //  Firewall SSH via IAP
    new gcp.compute.Firewall("allow-iap-ssh", {
      network: "default",
      allows: [{ protocol: "tcp", ports: ["22"] }],
      sourceRanges: ["35.235.240.0/20"],
    });

    //  Create VM using NEW runtime SA
    const vm = new gcp.compute.Instance("cloud-engineer-vm", {
      zone: "asia-southeast1-a",
      machineType: "e2-micro",
      tags: ["web-server"],

      bootDisk: {
        initializeParams: {
          image: "debian-cloud/debian-12",
        },
      },

      networkInterfaces: [
        {
          network: "default",
          accessConfigs: [{}],
        },
      ],

      //  VM now uses runtime SA (NOT GitHub SA)
      serviceAccount: {
        email: vmRuntimeSa.email,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      },

      metadataStartupScript: `#!/bin/bash
        apt-get update
        apt-get install -y docker.io google-cloud-cli
        systemctl enable docker
        systemctl start docker
        gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet
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