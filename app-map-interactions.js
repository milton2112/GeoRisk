(() => {
  function createAutoRotationController() {
    const pointers = new Set();
    let lastTick = null;
    let rotating = false;
    let lastCameraMotionAt = -Infinity;
    let hasCameraPose = false;
    const pose = { positionWC: {}, directionWC: {}, upWC: {} };
    const poseKeys = Object.keys(pose);
    const axes = ["x", "y", "z"];
    function cameraMoved(camera, fallback) {
      if (!poseKeys.every(key => camera?.[key])) return fallback;
      let moved = hasCameraPose ? false : fallback;
      for (const key of poseKeys) {
        const current = camera[key];
        const previous = pose[key];
        const tolerance = key === "positionWC" ? 0.01 : 1e-10;
        for (const axis of axes) {
          if (hasCameraPose && Math.abs(current[axis] - previous[axis]) > tolerance) moved = true;
          previous[axis] = current[axis];
        }
      }
      hasCameraPose = true;
      return moved;
    }
    function reset() {
      lastTick = null;
      rotating = false;
    }
    return {
      reset,
      isRotating: () => rotating,
      hasActivePointers: () => pointers.size > 0,
      pointerDown(id) { pointers.add(id); reset(); },
      pointerUp(id) {
        if (!pointers.delete(id)) return false;
        reset();
        return true;
      },
      releasePointers() { pointers.clear(); reset(); },
      step({ now, enabled, mode, navigating, visible, blocked, interactionAt, camera }) {
        if (!enabled || mode !== "3d") {
          hasCameraPose = false;
          lastCameraMotionAt = -Infinity;
          reset();
          return 0;
        }
        // Cesium move events also include frustum changes and sub-pixel numeric drift.
        // Only real pose changes extend the pause; our own rotation retains ownership.
        const moving = cameraMoved(camera, navigating);
        if (moving && !rotating) lastCameraMotionAt = now;
        if (!visible || blocked || pointers.size ||
            (moving && !rotating) || now - Math.max(interactionAt, lastCameraMotionAt) < 3200) {
          reset();
          return 0;
        }
        const seconds = lastTick === null ? 0 : Math.max(0, Math.min(0.05, (now - lastTick) / 1000));
        lastTick = now;
        // Camera moveStart also fires for our own rotation; retain its ownership.
        rotating = seconds > 0 || rotating;
        return seconds ? -seconds * 0.045 : 0;
      }
    };
  }

  function bindAutoRotationInput({ canvas, controller, onInteraction, document = window.document, host = window }) {
    const down = event => { controller.pointerDown(event.pointerId); onInteraction(); };
    const up = event => { if (controller.pointerUp(event.pointerId)) onInteraction(); };
    const pause = () => { controller.reset(); onInteraction(); };
    const leave = () => { controller.releasePointers(); onInteraction(); };
    canvas.addEventListener("pointerdown", down, { passive: true });
    canvas.addEventListener("wheel", pause, { passive: true });
    canvas.addEventListener("keydown", pause);
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointercancel", up, { passive: true });
    document.addEventListener("visibilitychange", leave);
    host.addEventListener("blur", leave);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("wheel", pause);
      canvas.removeEventListener("keydown", pause);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      document.removeEventListener("visibilitychange", leave);
      host.removeEventListener("blur", leave);
      controller.releasePointers();
    };
  }

  function getHoverSampleWindow({ isMobile = false, mode = "3d", reducedMotion = false } = {}) {
    if (isMobile) {
      return reducedMotion ? 140 : 96;
    }
    return mode === "2d" ? 64 : 34;
  }

  function shouldEnableHover({ isMobile = false, mode = "3d", preset = {}, isNavigating = false, qualityPreset = "auto", suppressedUntil = 0, now = Date.now() } = {}) {
    if (isMobile || mode === "2d" || isNavigating || qualityPreset === "performance") {
      return false;
    }
    return Boolean(preset.hoverEnabled) && now >= suppressedUntil;
  }

  function getNavigationTuning({ mode = "3d", isMobile = false } = {}) {
    return {
      inertiaSpin: isMobile ? 0.52 : 0.76,
      inertiaTranslate: mode === "2d" ? (isMobile ? 0.055 : 0.1) : (isMobile ? 0.44 : 0.7),
      inertiaZoom: mode === "2d" ? (isMobile ? 0.055 : 0.1) : (isMobile ? 0.4 : 0.58),
      maximumMovementRatio: mode === "2d" ? (isMobile ? 0.055 : 0.095) : (isMobile ? 0.13 : 0.16)
    };
  }

  function shouldDisableLabelsForFps({ fps = 60, isMobile = false, tier = "medium", mode = "3d" } = {}) {
    if (mode !== "3d") {
      return false;
    }
    const threshold = isMobile ? 18 : tier === "low" ? 16 : tier === "medium" ? 18 : 20;
    return fps < threshold;
  }

  function createFpsQualityMonitor() {
    let signature = null;
    let startedAt = 0;
    let frames = 0;
    let rollingFps = null;
    let lowWindows = 0;
    let highWindows = 0;
    let criticalWindows = 0;
    const eligible = context => context.visible && context.navigating && !context.transitioning;
    const key = context => [eligible(context), context.mode, context.qualityPreset,
      context.targetFrameRate, context.isMobile, context.tier].join(":");

    function reset(context, now) {
      signature = key(context);
      startedAt = now;
      frames = 0;
      rollingFps = null;
      lowWindows = highWindows = criticalWindows = 0;
    }

    function sync(context, now) {
      if (signature !== key(context)) reset(context, now);
      return eligible(context);
    }

    function recordFrame(context, now) {
      if (sync(context, now)) frames += 1;
    }

    function sample(context, now) {
      if (!sync(context, now)) return null;
      const elapsed = now - startedAt;
      // Only uninterrupted motion is comparable to the renderer's FPS limit.
      if (elapsed < 2000) return null;
      if (elapsed > 5000) {
        reset(context, now);
        return null;
      }
      const fps = frames * 1000 / elapsed;
      frames = 0;
      startedAt = now;
      rollingFps = rollingFps === null ? fps : rollingFps * 0.62 + fps * 0.38;
      const target = context.targetFrameRate;
      const low = Math.min(target * 0.8, context.isMobile ? 18 : context.tier === "low" ? 15 : context.tier === "medium" ? 18 : 20);
      const critical = Math.min(target * 0.3, context.isMobile || context.tier === "low" ? 7 : 9);
      lowWindows = rollingFps < low ? lowWindows + 1 : 0;
      highWindows = rollingFps >= target * 0.9 ? highWindows + 1 : 0;
      criticalWindows = context.mode === "3d" && rollingFps < critical ? criticalWindows + 1 : 0;
      let action = null;
      if (context.qualityPreset === "auto") {
        if (criticalWindows >= 3) {
          action = "fallback";
          criticalWindows = lowWindows = 0;
        } else if (lowWindows >= 2) {
          action = "reduce";
          lowWindows = 0;
        } else if (highWindows >= 3) {
          action = "recover";
          highWindows = 0;
        }
      }
      return { fps, rollingFps, action };
    }

    return { reset, recordFrame, sample };
  }

  function installRenderRecovery({ viewer, onStateChange = () => {}, document = window.document }) {
    const scene = viewer.scene;
    const canvas = scene.canvas;
    let phase = "healthy";
    let attempts = 0;
    let disposed = false;
    let firstFrame = null;
    let secondFrame = null;
    let visibleWaitMs = 0;
    let lastError = null;
    let poll = null;

    function cancelFrames() {
      if (firstFrame !== null) cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) cancelAnimationFrame(secondFrame);
      firstFrame = secondFrame = null;
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      cancelFrames();
      clearInterval(poll);
      poll = null;
      document.removeEventListener("visibilitychange", syncPolling);
      removeError();
      removePostRender();
      canvas.removeEventListener("webglcontextlost", contextLost);
    }

    function alive() {
      if (!disposed && viewer.isDestroyed()) dispose();
      return !disposed;
    }

    function notify(nextPhase, error = lastError) {
      phase = nextPhase;
      try {
        onStateChange({ phase, attempts, error });
      } catch (callbackError) {
        console.error("Render recovery notification failed:", callbackError);
      }
    }

    function fail(error) {
      if (!alive() || phase === "failed") return;
      lastError = error;
      cancelFrames();
      viewer.useDefaultRenderLoop = false;
      notify("failed");
      dispose();
    }

    function handleError(_scene, error) {
      if (!alive() || phase === "failed") return;
      lastError = error;
      if (phase === "waiting") return;
      if (attempts > 0) {
        fail(error);
        return;
      }
      attempts += 1;
      viewer.useDefaultRenderLoop = false;
      notify("waiting");
      if (!alive() || phase !== "waiting") return;
      // Drain the old Cesium animation callback before starting a new loop.
      firstFrame = requestAnimationFrame(() => {
        firstFrame = null;
        if (!alive() || phase !== "waiting") return;
        secondFrame = requestAnimationFrame(() => {
          secondFrame = null;
          if (!alive() || phase !== "waiting") return;
          visibleWaitMs = 0;
          notify("retrying");
          if (!alive() || phase !== "retrying") return;
          try {
            viewer.useDefaultRenderLoop = true;
            scene.requestRender();
          } catch (restartError) {
            fail(restartError);
          }
        });
      });
    }

    const removeError = scene.renderError.addEventListener(handleError);
    const removePostRender = scene.postRender.addEventListener(() => {
      if (alive() && phase === "retrying" && viewer.useDefaultRenderLoop) notify("recovered");
    });
    const contextLost = () => fail(new Error("WebGL context lost"));
    canvas.addEventListener("webglcontextlost", contextLost);
    function checkLoop() {
      if (!alive() || document.visibilityState === "hidden" || phase === "failed" || phase === "waiting") return;
      // Widget resize/clock errors can stop the loop without a scene renderError.
      if (!viewer.useDefaultRenderLoop) {
        handleError(scene, new Error("Render loop stopped"));
      } else if (phase === "retrying") {
        visibleWaitMs += 1000;
        if (visibleWaitMs >= 8000) fail(new Error("No rendered frame after retry"));
      }
    }

    function syncPolling() {
      clearInterval(poll);
      poll = null;
      if (alive() && document.visibilityState !== "hidden") poll = setInterval(checkLoop, 1000);
    }
    document.addEventListener("visibilitychange", syncPolling);
    syncPolling();

    return { dispose, getState: () => ({ phase, attempts }) };
  }

  window.GeoRiskMapInteractions = {
    createAutoRotationController,
    bindAutoRotationInput,
    installRenderRecovery,
    createFpsQualityMonitor,
    getHoverSampleWindow,
    getNavigationTuning,
    shouldDisableLabelsForFps,
    shouldEnableHover
  };
})();
