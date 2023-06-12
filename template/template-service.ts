import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

export async function createHtml(html: string, fileName: string) {
  const folderPath = path.join(__dirname, "../output");
  const filePath = path.join(folderPath, fileName);
  if (!fsSync.existsSync(folderPath)) {
    await fs.mkdir(folderPath);
  }

  await fs.writeFile(filePath, html, {
    encoding: "utf8",
  });
}
