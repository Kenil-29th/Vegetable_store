import fs from "fs/promises";
import path from "path";

export async function deleteFile(relativePath) {
  if (!relativePath) return;
  try {
    const full = path.join(process.cwd(), relativePath);
    await fs.unlink(full).catch(() => {});
  } catch (err) {
    // ignore
  }
}
