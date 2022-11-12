
## Description
A Independent Product Called Animal-Go, A Funny Community
NOT FOR ANY BUSINESS. JUST FOR FUN

Frontend is on the way
Backend is improving

## Installation

```bash
$ npm i
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Commit 
```bash
# commit your code in formatted
$ npm run cz
```

## Docker running env without docker-compose

Kafka
```bash
docker run -d --name kafka \
-p 9092:9092 \
-e KAFKA_BROKER_ID=0 \
-e KAFKA_ZOOKEEPER_CONNECT=IP:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://IP:9092 \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 wurstmeister/kafka
```
Zookeeper
```bash
docker run -d --name zookeeper -p 2181:2181 -t wurstmeister/zookeeper
```
MySQL
```bash
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql
```
Redis
```bash
docker run -p 6379:6379 --name redis -v /data/redis/redis.conf:/etc/redis/redis.conf  -v /data/redis/data:/data -d redis redis-server /etc/redis/redis.conf --appendonly yes
```
