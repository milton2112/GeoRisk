import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { CONTENT_SECURITY_POLICY, BROWSER_SECURITY_HEADERS, assertBrowserSecurityPolicy, renderStaticHostingHeaders } from "../lib/browser-security-policy.js";
import { replaceKnockoutGlobalLookup } from "../lib/cesium-csp.js";

const html = await fs.readFile("index.html", "utf8");
assertBrowserSecurityPolicy(html);
assert.throws(() => assertBrowserSecurityPolicy(html.replace("script-src-attr 'none'", "script-src-attr 'unsafe-inline'")), /CSP/);
assert.throws(() => assertBrowserSecurityPolicy(`<script src="early.js"></script>${html}`), /CSP/);
assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i, "bootstrap must be external, without inline scripts");
assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
assert.equal(/\son(?:error|load|click)\s*=\s*["']/i.test(await fs.readFile("script.js", "utf8")), false, "render templates must not use inline handlers");
const directives = new Map(CONTENT_SECURITY_POLICY.split("; ").map(value => {
  const [key, ...sources] = value.split(" ");
  return [key, sources];
}));
for (const key of ["default-src", "base-uri", "object-src", "form-action", "script-src-attr"]) {
  assert.deepEqual(directives.get(key), ["'none'"]);
}
assert.ok(directives.get("script-src").includes("'wasm-unsafe-eval'"), "Cesium feature detection needs WebAssembly, not JS eval");
assert.ok(!directives.get("script-src").some(value => ["'unsafe-inline'", "'unsafe-eval'", "blob:", "data:", "https:", "*"].includes(value)));
assert.ok(!CONTENT_SECURITY_POLICY.includes("*"), "do not allow wildcard origins");
assert.equal(BROWSER_SECURITY_HEADERS["X-Frame-Options"], "SAMEORIGIN");
assert.ok(BROWSER_SECURITY_HEADERS["Content-Security-Policy"].endsWith("frame-ancestors 'self'"));
assert.ok(!CONTENT_SECURITY_POLICY.includes("frame-ancestors"), "meta CSP cannot enforce frame-ancestors");
const headerLines = renderStaticHostingHeaders().trimEnd().split("\n");
assert.equal(headerLines.shift(), "/*", "hosting headers must apply to all paths");
assert.deepEqual(Object.fromEntries(headerLines.map(line => {
  assert.ok(line.startsWith("  "));
  assert.ok(Buffer.byteLength(line) < 2000, "Cloudflare Pages limits each header line to 2000 bytes");
  const separator = line.indexOf(":");
  return [line.slice(2, separator), line.slice(separator + 2)];
})), BROWSER_SECURITY_HEADERS);
assert.ok(!(await fs.readFile("sw.js", "utf8")).includes('"_headers"'), "deployment configuration must stay outside precache");
for (const file of ["sw.js", "scripts/buildProduction.js"]) assert.ok((await fs.readFile(file, "utf8")).includes("app-bootstrap.js"));

const file = "node_modules/@cesium/widgets/Source/ThirdParty/knockout-3.5.1.js";
const source = 'result = (0,eval)("this");';
for (const path of [file, file.replaceAll("/", "\\")]) {
  const transformed = replaceKnockoutGlobalLookup(source, path);
  const context = vm.createContext({}, { codeGeneration: { strings: false } });
  vm.runInContext(transformed, context);
  assert.equal(vm.runInContext("result === globalThis", context), true);
}
assert.equal(replaceKnockoutGlobalLookup(source, "other.js"), source, "never alter unrelated sources");
assert.throws(() => replaceKnockoutGlobalLookup("changed upstream", file), /changed/);
assert.throws(() => replaceKnockoutGlobalLookup(source + source, file), /changed/);
assert.doesNotMatch(replaceKnockoutGlobalLookup(await fs.readFile(file, "utf8"), file), /\(0,eval\)\("this"\)/);
console.log("browser-security-policy.test.js ok");
