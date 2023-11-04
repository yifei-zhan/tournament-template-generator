#### Rules

##### Matches.csv

- Only matches with both filled in team1 scores & team2 scores are considered as `ended` game.
- Players with named with `*`, will not be considered in any ranking tables.
  - Example: `Alex*` (will not appear in the scores ranking table)

#### TODO

1. ~~match check~~
   1. ~~进球数 match 进球人数 (校验所有人员)~~
   1. ~~如何处理自由球员? (生成数据表的时候 移除出数据?)~~
2. ~~助攻榜~~ / ~~红黄牌榜~~
   1. ~~common ranking-service~~
   2. ~~common ranking-generator~~
   3. ~~common ranking-template~~
   4. ~~助攻数 自由球员不同球队?~~
3. 完赛结果
4. integration test -> 优化 build 之后的流程。从统计员方 检查整个流程是否简便
5. application as a service(go cloud?)
6. 其他优化
   - node -> exec 文件: https://github.com/nexe/nexe?
     - 如何处理报错信息?
     - 测试
   - 队员号码 id(low prior)
7. windows 下的 斜线问题
8. build 后的 node_modules 问题
