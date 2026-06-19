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
export const writeJsonWithRetry = (file, value, options) => retryFileOperation(() => fs.writeJson(file, value, options));
