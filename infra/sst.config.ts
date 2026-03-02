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
    // read file startup.sh
    const fs = await import("fs");
    const rawScript = fs.readFileSync("startup.sh", "utf-8");
    const startupScriptContent = rawScript.replace(/\r\n/g, '\n');

    // 1 custom vcp: virtual cloud private
    const vcp = new gcp.compute.Network("custom-vcp", {
      autoCreateSubnetworks: false,
    });

    // 2 create subnet 
    const subnet = new gcp.compute.Subnetwork("custom-subnet", {
      ipCidrRange: "10.0.0.0/24",
      region: "asia-southeast1",
      network: vcp.id,
    });

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
      network: vcp.id,
      allows: [{ protocol: "tcp", ports: ["80"] }],
      sourceRanges: [
        "130.211.0.0/22", // IP Của Google Load Balancer
        "35.191.0.0/16"   // IP Của Google Health Check
      ],
      targetTags: ["web-server"],
    });

    //  Firewall SSH via IAP
    new gcp.compute.Firewall("allow-iap-ssh", {
      network: vcp.id,
      allows: [{ protocol: "tcp", ports: ["22"] }],
      sourceRanges: ["35.235.240.0/20"],
      targetTags: ["web-server"],
    });

    //  Instance Template 
    const instanceTemplate = new gcp.compute.InstanceTemplate("vm-template", {
      machineType: "e2-micro",

      tags: ["web-server"],

      disks: [{
        boot: true,
        autoDelete: true,
        sourceImage: "debian-cloud/debian-12",
      }],

      networkInterfaces: [{
        network: vcp.id,
        subnetwork: subnet.id,
        accessConfigs: [{}],
      }],

      serviceAccount: {
        email: vmRuntimeSa.email,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      },

      metadataStartupScript: startupScriptContent,
    });

    //  Managed Instance Group 
    const instanceGroupManager = new gcp.compute.InstanceGroupManager("vm-mig", {
      zone: "asia-southeast1-a",
      baseInstanceName: "cloud-engineer",
      versions: [{
        instanceTemplate: instanceTemplate.id,
      }],
      targetSize: 1,
      namedPorts: [{
        name: "http",
        port: 80,
      }],
    });

    // load balancer
    // healthCheck
    const healthCheck = new gcp.compute.HealthCheck("web-hc", {
      httpHealthCheck: {
        port: 80,
        requestPath: "/health",
      },
    });

    // backend service
    const backendService = new gcp.compute.BackendService("backend-service", {
      loadBalancingScheme: "EXTERNAL",
      protocol: "HTTP",
      portName: "http",
      healthChecks: healthCheck.id,
      backends: [
        {
          group: instanceGroupManager.instanceGroup,
        },
      ],
    });

    // url map 
    const urlMap = new gcp.compute.URLMap("url-map", {
      defaultService: backendService.id,
    });

    // http proxy
    const httpProxy = new gcp.compute.TargetHttpProxy("http-proxy", {
      urlMap: urlMap.id,
    });

    // public ip for load balancer
    const lbIp = new gcp.compute.GlobalAddress("lb-ip");

    // forwarding rule
    new gcp.compute.GlobalForwardingRule("http-forwarding-rule", {
      target: httpProxy.id,
      portRange: "80",
      ipAddress: lbIp.address,
    });

    return {
      loadBalancerIP: lbIp.address,
    };
  },
});