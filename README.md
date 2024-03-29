## Use App via Docker

1. install docker

2. start docker

3. create a folder [folder_name]

4. prepare valid input folder(with \*.csv) in [folder_name]

5. run following command to pull image

   ```bash
   $ docker image pull zhanyifei/tournament
   ```

##### Then update input and rerun following command to generate latest output

```bash
# 1. try to remove exsiting old container if exists
# 2. when running new container, using volume to reflect current host input to docker container input folder
$ docker rm -f tournament_container 2>/dev/null || true && docker run -v ./input:/usr/src/dist/input --name tournament_container zhanyifei/tournament

# All files from docker container output will be (over)written to host:output in current directory
$ docker cp tournament_container:/usr/src/dist/output .
```

## Use App via AWS Lambda

... TODO

## Proposed running process

```bash
# build base image
$ docker build . -t tournament-base -f Dockerfile.base
```

Push to Dockerhub

```bash
$ docker build . -t [image-name]:[tag-name]
# push image to docker-hub
$ docker login
$ docker tag [image-name]:[tag-name] [username]/[repository]:[tag-name]
$ docker push [username]/[repository]:[tag-name]
```

Push to AWS

```bash
$ docker build . -t [image-name]:[tag-name] -f Dockerfile.aws
# ... todo
```

## Rules

##### Matches.csv

- Only matches with both filled in team1 scores & team2 scores are considered as `ended` game.
- Players with named with `*`, will not be considered in any ranking tables.
  - Example: `Alex*` (will not appear in the scores ranking table)
- Either `分组` && `轮次` or `淘汰赛分区` && `淘汰赛轮次` should be filled

## TODO

1. 完赛结果
2. integration test -> 优化 build 之后的流程。从统计员方 检查整个流程是否简便
3. 其他优化

- 队员号码 id(low prior)
  - 如何处理报错信息?
  - 测试
