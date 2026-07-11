import fs from "fs-extra";

const RETRYABLE_CODES = new Set(["UNKNOWN", "EBUSY", "EACCES", "EPERM", "EMFILE"]);

export async function retryFileOperation(operation, options = {}) {
  const attempts = Math.max(1, Number(options.attempts || 6));
  const delayMs = Math.max(10, Number(options.delayMs || 70));

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === attempts || !RETRYABLE_CODES.has(error?.code)) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }

  return null;
}

export const readJsonWithRetry = file => retryFileOperation(() => fs.readJson(file));
export const readFileWithRetry = (file, encoding) => retryFileOperation(() => fs.readFile(file, encoding));
export const statWithRetry = file => retryFileOperation(() => fs.stat(file));
export const writeFileWithRetry = (file, value) => retryFileOperation(() => fs.writeFile(file, value));
export const writeJsonWithRetry = (file, value, options) => retryFileOperation(() => fs.writeJson(file, value, options));

export function areJsonValuesEquivalent(left, right) {
  if (Object.is(left, right)) return true;
  if (left === null || right === null || typeof left !== typeof right) return false;
  if (typeof left !== "object") return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((item, index) => areJsonValuesEquivalent(item, right[index]));
  }

  const leftKeys = Object.keys(left).filter(key => left[key] !== undefined);
  const rightKeys = Object.keys(right).filter(key => right[key] !== undefined);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every(key => (
    Object.prototype.hasOwnProperty.call(right, key)
    && areJsonValuesEquivalent(left[key], right[key])
  ));
}

export async function writeJsonIfChanged(file, value, options) {
  try {
    const current = await readJsonWithRetry(file);
    if (areJsonValuesEquivalent(current, value)) return false;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await writeJsonWithRetry(file, value, options);
  return true;
}
