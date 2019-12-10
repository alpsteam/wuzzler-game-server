const bodyParser = require("body-parser");
const express = require('express');
const SSEChannel = require('sse-pubsub');
const app = express();
const channel = new SSEChannel();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let sse_response;
let sse_request;

let score = {
  team_1: 0,
  team_2: 0,
  status: "stopped", // started, finished, stopped
  game_id: null
}

let settings = { 
  goals_to_win_game: 10  
}

app.get("/score", (req, res) => {
  res.json(score);
})

app.put("/score", (req,res) => {
  const event = req.body;
  console.log(event);
  
  if(event["status"] && (event["status"] ==  "stopped" || event["status"] == "started" || event["status"] == "finished")) {
    if(score.status == "stopped" && event["status"] == "started") newGame();
    if(score.status == "finished" && event["status"] == "started") newGame();
    if(score.status == "started" && event["status"] == "stopped") stopGame();
    
  } else if(score.status == "started") {
    if(event["team_1"] && (event["team_1"] == 1 || event["team_1"] == -1)) {
      scoreTeam1(event);
    }
    if(event["team_2"] && (event["team_2"] == 1 || event["team_2"] == -1)) {
      scoreTeam2(event);
    }
    checkForWinner();
  } else {
    res.status(400).send('Update score only when game is "started" and change status only to "started" or "stopped".');
  }
  updateScoreAtClient();
  res.send(score);
})

function scoreTeam1(event) {
  score.team_1 += parseInt(event["team_1"]);
}

function scoreTeam2(event) {
  score.team_2 += parseInt(event["team_2"]);
}

function newGame() {
  score.game_id = Date.now();
  score.team_1 = score.team_2 = 0;
  score.status = "started";
  writeEventToDB();
}

function stopGame() {
  score.status = "stopped";
  writeEventToDB();
}

function gameFinished() {
  score.status = "finished";
  console.log("gameFinishedFunction");
  console.log(score.status)
  writeEventToDB();
  writeGameResultToDB();
}

function writeEventToDB() {
  // write event to DB
}

function writeGameResultToDB() {
  //write score to DB
  //table need to be created
}

function checkForWinner() {
  console.log("checkForWinner");
  if(score.team_1 == settings.goals_to_win_game || score.team_2 == settings.goals_to_win_game) {
    console.log("gameFinished");
    gameFinished();
  }
}

function updateScoreAtClient() {
  channel.publish(JSON.stringify(score), "event");
}

app.get('/wuzzler-stream', (req, res) => channel.subscribe(req, res));

app.listen(8080, function () {
  console.log('Welcome to ACW!');
});