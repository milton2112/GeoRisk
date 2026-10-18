import assert from "node:assert/strict";
import { collectBrowserGpuInfo, selectBrowserGpuInfo } from "../lib/profile-gpu.js";

const gpu = { devices: [{ vendorId: 65535, deviceId: 1, vendorString: "Google", deviceString: "SwiftShader",
  driverVendor: "ANGLE", driverVersion: "1", unused: "excluded" }],
  featureStatus: { gpu_compositing: "disabled_software", webgl: "enabled_readback", unknown_future_feature: "disabled_off" },
  auxAttributes: { secret: "excluded" } };
const original = JSON.stringify(gpu);
const selected = selectBrowserGpuInfo(gpu);
assert.deepEqual(selected.featureStatus, gpu.featureStatus, "preserve exact browser feature keys and values without inference");
assert.equal(JSON.stringify(gpu), original);
assert.equal(selected.devices[0].unused, undefined);
assert.equal(selected.auxAttributes, undefined);
assert.equal(selectBrowserGpuInfo({ devices: gpu.devices }).status, "unavailable", "optional absent features leave compositor status unknown");
assert.equal(selectBrowserGpuInfo({ devices: gpu.devices }).featureStatus, null);
for (const invalid of [null, { ...gpu, devices: Array(9).fill(gpu.devices[0]) },
  { ...gpu, featureStatus: [] }, { ...gpu, featureStatus: { webgl: 1 } },
  { ...gpu, featureStatus: Object.fromEntries(Array.from({ length: 65 }, (_, i) => [i, "enabled"])) },
  { ...gpu, devices: [{ vendorId: NaN, deviceId: 0 }] },
  { ...gpu, devices: [{ ...gpu.devices[0], deviceString: "a".repeat(513) }] }]) {
  assert.throws(() => selectBrowserGpuInfo(invalid));
}

for (const mode of ["ok", "unsupported", "malformed"]) {
  const calls = [];
  const browser = { async newBrowserCDPSession() {
    calls.push("open");
    return { async send(command) {
      calls.push(command);
      if (mode === "unsupported") throw new Error("unsupported");
      return { gpu: mode === "malformed" ? null : gpu };
    }, async detach() { calls.push("detach"); } };
  } };
  if (mode === "malformed") await assert.rejects(collectBrowserGpuInfo(browser));
  else assert.equal((await collectBrowserGpuInfo(browser)).status, mode === "ok" ? "collected" : "unavailable");
  assert.deepEqual(calls, ["open", "SystemInfo.getInfo", "detach"], "one request and unconditional session cleanup");
}
console.log("profile-gpu.test.js ok: exact bounded features, device identity, explicit unknown status and session cleanup");
