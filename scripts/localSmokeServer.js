import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"]
]);

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Cross-Origin-Resource-Policy": "cross-origin",
    ...headers
  });
  res.end(body);
}

function resolveRequestPath(urlPath, root) {
  const decodedPath = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath).replace(/\\/g, "/");
  const absolutePath = path.resolve(root, `.${decodedPath}`);
  const relativePath = path.relative(root, absolutePath);

  if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    return null;
  }

  return absolutePath;
}

export function createLocalSmokeServer({ root = projectRoot } = {}) {
  const resolvedRoot = path.resolve(root);
  return http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
      const filePath = resolveRequestPath(requestUrl.pathname, resolvedRoot);

      if (!filePath) {
        send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
        return;
      }

      const stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES.get(extension) || "application/octet-stream";
      const body = await fs.readFile(filePath);
      send(res, 200, body, { "Content-Type": contentType });
    } catch (error) {
      const statusCode = error?.code === "ENOENT" ? 404 : 500;
      send(res, statusCode, statusCode === 404 ? "Not found" : "Server error", {
        "Content-Type": "text/plain; charset=utf-8"
      });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 5525);
  const host = process.env.HOST || "127.0.0.1";
  const server = createLocalSmokeServer();

  server.listen(port, host, () => {
    console.log(`GeoRisk smoke server: http://${host}:${port}/`);
  });
}
