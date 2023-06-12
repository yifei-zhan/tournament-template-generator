import fs from "fs";
import path from "path";
import assert from "assert";

assert(process.argv.length >= 3, "Source file path must be specified");

const sourceRelativePathes = process.argv.slice(2);
assert(sourceRelativePathes);
assert(sourceRelativePathes.length > 0);

for (const sourcePath of sourceRelativePathes) {
  const source = path.join(__dirname, sourcePath);
  const destination = path.join(__dirname, "build", sourcePath);
  assert(fs.existsSync(source), "Source file doesn't exist");

  fs.copyFileSync(source, destination);
}
