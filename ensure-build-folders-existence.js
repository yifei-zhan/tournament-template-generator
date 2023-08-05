const fs = require('fs');
const pathes = ['./build/input'];

pathes.forEach((path) => {
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Directory: ${path} does not exist. Creating now...`);
      fs.mkdir(path, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });
});
