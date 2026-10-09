// Keep public resize/render synchronous; yield only the stopped-clock default loop.
export function deferCesiumResolutionResize(source, filename) {
  if (!/[/\\]@cesium[/\\]engine[/\\]Source[/\\]Widget[/\\]CesiumWidget\.js$/.test(filename)) return source;
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = text => text.replace(/\n/g, newline);
  const loop = "function startRenderLoop(widget) {";
  const failure = lines("      } catch (error) {\n        widget._useDefaultRenderLoop = false;");
  const stop = "        this._useDefaultRenderLoop = value;";
  const stopped = lines("    } else {\n      widget._renderLoopRunning = false;");
  const destroy = "CesiumWidget.prototype.destroy = function () {";
  const resize = lines("  this._forceResize = false;\n\n  configureCanvasSize(this);\n  configureCameraFrustum(this);");
  const frames = /^( +)widget\.resize\(\);\r?\n\1widget\.render\(\);$/gm;
  if (source.includes("_geoRiskResizeFence") || [loop, failure, stop, stopped, destroy, resize].some(text => source.split(text).length !== 2) ||
      [...source.matchAll(frames)].length !== 2) {
    throw new Error("Cesium resize lifecycle changed; review nonblocking resolution resize before publishing.");
  }
  const helpers = lines(`function releaseResolutionResizeFence(widget) {
  const pending = widget._geoRiskResizeFence;
  if (defined(pending)) {
    widget._geoRiskResizeFence = undefined;
    pending.gl.deleteSync(pending.sync);
  }
}

function resolutionResizeReady(widget, frameTime) {
  const pending = widget._geoRiskResizeFence;
  if (!widget._forceResize) {
    if (defined(pending)) releaseResolutionResizeFence(widget);
    return true;
  }
  const scene = widget._scene;
  const canvas = widget._canvas;
  if (!defined(scene._lastRenderTime) || !scene._context.webgl2 || widget._clock.shouldAnimate ||
      widget._canvasClientWidth !== canvas.clientWidth || widget._canvasClientHeight !== canvas.clientHeight ||
      widget._lastDevicePixelRatio !== window.devicePixelRatio) {
    releaseResolutionResizeFence(widget);
    return true;
  }
  const gl = scene._context._gl;
  if (defined(pending)) {
    if (pending.gl !== gl) {
      releaseResolutionResizeFence(widget);
      return true;
    }
    const status = gl.clientWaitSync(pending.sync, 0, 0);
    const elapsed = frameTime - pending.startedAt;
    pending.polls++;
    if (status === gl.TIMEOUT_EXPIRED && elapsed >= 0 && elapsed < 1500 && pending.polls < 64) return false;
    releaseResolutionResizeFence(widget);
    return true;
  }
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  if (!defined(sync)) return true;
  widget._geoRiskResizeFence = { gl, sync, startedAt: frameTime, polls: 0 };
  gl.flush();
  return false;
}

`);
  return source.replace(frames, (_, indent) => lines(`${indent}if (resolutionResizeReady(widget, frameTime)) {\n${indent}  widget.resize();\n${indent}  widget.render();\n${indent}}`))
    .replace(loop, helpers + loop)
    .replace(failure, failure.replace("        widget._useDefaultRenderLoop", "        releaseResolutionResizeFence(widget);" + newline + "        widget._useDefaultRenderLoop"))
    .replace(stop, stop + newline + "        if (!value) releaseResolutionResizeFence(this);")
    .replace(stopped, stopped.replace("      widget._renderLoopRunning", "      releaseResolutionResizeFence(widget);" + newline + "      widget._renderLoopRunning"))
    .replace(destroy, destroy + newline + "  releaseResolutionResizeFence(this);");
}
