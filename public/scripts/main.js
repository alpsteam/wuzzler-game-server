SERVER_API_POINT = 'http://'+window.location.hostname+'/score';

// get DOM elements
const html_game_id = document.querySelector('#game_id');
const html_status = document.querySelector('#status');
const html_team_1 = document.querySelector('#team_1');
const html_team_2 = document.querySelector('#team_2');
const button_game_status = document.querySelector('#button_game_status');

// variable keeps track of the score
let score = null;

// create sse stream to get updates from server
const sseSource = new EventSource('/wuzzler-stream');
sseSource.onerror = () => { refreshPage("sse connection failed") };
sseSource.addEventListener('event', ev => {
    console.log(ev.data);
    score = JSON.parse(ev.data);
    updateDOM();
});

fetchScore().then((data) => {
    score = data;
    updateDOM();
});

// update all HTML elements from score variable
function updateDOM() {
    html_game_id.textContent = score["game_id"] || "no active game";
    html_status.textContent = score["status"];
    html_team_1.textContent = score["team_1"];
    html_team_2.textContent = score["team_2"];

    if(!score["status"]) "Something bad happened.";
    else if(score["status"]=="started") button_game_status.src = "images/stop_button.png";
    else if(score["status"]=="finished" || score["status"]=="stopped") button_game_status.src = "images/start_button.png";
}

// fetch score with GET request
async function fetchScore () {
    let response = await fetch(SERVER_API_POINT);
    let data = await response.json();
    return data;
}

// send PUT request when game status is updated
async function updateGameStatus() {
    let updated_status;
    if(!score["status"]) refreshPage();
    if(score["status"]=="started") updated_status = "stopped";
    if(score["status"]=="finished" || score["status"]=="stopped") updated_status = "started";

    return fetch(SERVER_API_POINT, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({status: updated_status})
    }).then(response => response.json())
}

// send PUT request when score is corrected
async function correctScore(team_no, score_correction) {
    const payload = {[team_no]: score_correction};
    console.log(payload)
    return fetch(SERVER_API_POINT, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(payload)
    }).then(response => response.json())
}

// if sse connection fails or something else bad happens refresh page
function refreshPage(error) {
    console.log(error);
    window.location.reload(true); 
}

// When finished with the source close the connection
// sseSource.close();