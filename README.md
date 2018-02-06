# coinmarket-pwa

Live site://coin.leanapp.cn/)

## Development

install dependencies
```sh
npm install
```
run backend
```sh
lean up
# or not use leancloud
npm run dev
```
run frontend
```sh
npm run dev:web
```

## Deploy
build frontend
```sh
npm run build
```
then 
```sh
lean deploy
# or not use leancloud, deploy to your server and run
npm run start
```
process manage
```sh
pm2 start process.json
```
