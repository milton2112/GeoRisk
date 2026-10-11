// Select diagnostic metadata only; never retain command lines or the full aux map.
export function selectBrowserGpuInfo(gpu) {
  const string = value => {
    if (typeof value !== "string" || value.length > 512) throw new Error("Invalid bounded GPU metadata.");
    return value;
  };
  if (!gpu || !Array.isArray(gpu.devices) || gpu.devices.length > 8 ||
      (gpu.featureStatus !== undefined && (!gpu.featureStatus || typeof gpu.featureStatus !== "object" || Array.isArray(gpu.featureStatus)))) {
    throw new Error("Invalid bounded GPU metadata.");
  }
  const features = Object.entries(gpu.featureStatus || {});
  if (features.length > 64) throw new Error("GPU feature metadata exceeds its bound.");
  return {
    status: gpu.featureStatus === undefined ? "unavailable" : "collected",
    featureStatus: gpu.featureStatus === undefined ? null : Object.fromEntries(features.map(([key, value]) => [string(key), string(value)])),
    devices: gpu.devices.map(device => {
      const selected = {};
      for (const key of ["vendorId", "deviceId"]) {
        if (!Number.isSafeInteger(device?.[key]) || device[key] < 0) throw new Error("Invalid GPU device identity.");
        selected[key] = device[key];
      }
      for (const key of ["vendorString", "deviceString", "driverVendor", "driverVersion"]) {
        if (device[key] !== undefined) selected[key] = string(device[key]);
      }
      return selected;
    })
  };
}

// Call only after CPU/trace collection ends; the owned browser closes on failure.
export async function collectBrowserGpuInfo(browser) {
  const session = await browser.newBrowserCDPSession();
  try {
    let response;
    try {
      response = await session.send("SystemInfo.getInfo");
    } catch {
      return { status: "unavailable", reason: "SystemInfo.getInfo failed; compositor status is unknown." };
    }
    return selectBrowserGpuInfo(response.gpu);
  } finally {
    await session.detach();
  }
}
