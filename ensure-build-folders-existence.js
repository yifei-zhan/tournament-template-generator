const fs = require("fs");
const path = require("path");
const assert = require("assert");

assert(process.argv.length >= 3, "Source file path must be specified");

const folders = process.argv.slice(2);
assert(folders);
assert(folders.length > 0);

folders.forEach((folder) => {
  const buildPath = path.join(__dirname, "dist", folder);

  fs.access(buildPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Directory: ${buildPath} does not exist. Creating now...`);
      fs.mkdir(buildPath, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });
});
