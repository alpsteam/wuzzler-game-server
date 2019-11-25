# Game server 

Run locally with
```
npm i
nodeamon index.js
```
or build with Docker.
```
docker build -t game-server . 
docker run -p 8080:8080 -d game-server
```