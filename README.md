#### How to make files in build/bin exectuable

1. install node
2. `npm install`
3. `npm run build`
4. `sudo npm link` (add symlink for current project so that exectuable files can be accessible from $PATH)
5. check the added symlink: `npm ls -g --depth=0 --link=true`
6. execute the file: [file-name] [options]
   - `generate-group-tables [--gid A]`
7. cleanup: `sudo npm rm -g [symlink-name]` (symlink-name does not contain the version)

#### TODO

1. match check
   1. 进球数 match 进球人数
2. 助攻榜
3. 红黄牌榜
4. 完赛结果
5. integration test -> 优化 build 之后的流程。从统计员方 检查整个流程是否简便
6. application as a service(go cloud?)
7. 其他优化
   _. node -> exec 文件: https://github.com/nexe/nexe?
   _. 队员号码 id(low prior)
