#### How to make files in build/bin exectuable

1. install node
2. `npm install`
3. `npm run build`
4. `sudo npm link` (add symlink for current project so that exectuable files can be accessible from $PATH)
5. check the added symlink: `npm ls -g --depth=0 --link=true`
6. execute the file: [file-name] [options]
   - `generate-group-table --gid A`
7. cleanup: `sudo npm rm -g [symlink-name]` (symlink-name does not contain the version)

#### TODO

1. more elegant add/remove executable to global
2. table title also configurable?
