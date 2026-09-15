import fs from "node:fs/promises";
import path from "node:path";

export function isSensitivePath(relativePath) {
  const parts = relativePath.replace(/\\/g, "/").toLowerCase().split("/");
  return parts.some(part =>
    /^(?:\.git|\.svn|\.hg|\.ssh|\.aws|\.azure|\.config|\.cache|node_modules)$/.test(part) ||
    /^\.env(?:$|[.-])/.test(part) ||
    /^(?:\.envrc|\.npmrc|\.netrc|\.pypirc|credentials(?:\.[\w.-]+)?|secrets?(?:\.[\w.-]+)?|service[-_]?account(?:[-_.][\w.-]+)?\.json|id_(?:rsa|dsa|ecdsa|ed25519)(?:\..*)?)$/.test(part) ||
    /\.(?:pem|key|p12|pfx|keystore|jks|kdbx)(?:\.(?:bak|old|backup))?$/.test(part)
  );
}

export function isInternalRequest(relativePath) {
  return isSensitivePath(relativePath) || relativePath.replace(/\\/g, "/").split("/").some(part =>
    part.startsWith(".") || /^(?:scripts|reports|tmp|temp|coverage|build|dist)$/i.test(part)
  );
}

export async function assertPublishableTree(root) {
  if (!(await fs.lstat(root)).isDirectory()) throw new Error("Directorio publico invalido o enlace simbolico.");
  async function visit(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(root, absolute);
      if (isSensitivePath(relative) || entry.name.startsWith(".") || entry.isSymbolicLink()) {
        throw new Error(`Archivo sensible o enlace no permitido en build: ${relative}`);
      }
      if (entry.isDirectory()) await visit(absolute);
    }
  }
  await visit(root);
}
