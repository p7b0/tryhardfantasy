const api = {
  baseUrl: 'https://statsapi.web.nhl.com/api/v1'
};

const myTeam = [];
const myOpponent = [];

const managerStats = {
  goals: 0,
  assists: 0,
  points: 0,
  plusMinus: 0,
  pim: 0,
  ppp: 0,
  shp: 0,
  gwg: 0,
  sog: 0,
  fw: 0,
  hit: 0,
  blk: 0,
  w: 0,
  gaa: 0,
  sv: 0,
  svp: 0,
  sho: 0
};

const opponentsAvgStats = {
  goals: 0,
  assists: 0,
  points: 0,
  plusMinus: 0,
  pim: 0,
  ppp: 0,
  shp: 0,
  gwg: 0,
  sog: 0,
  fw: 0,
  hit: 0,
  blk: 0,
  w: 0,
  gaa: 0,
  sv: 0,
  svp: 0,
  sho: 0
};

//simply averages out the stats given by the number of games they're based on...as of now, it's limited to the season being selected
const averageOutStats = async(stats) => {
  let avgStats = {
    games: 0,
    goals: 0,
    assists: 0,
    points: 0,
   	plusMinus: 0,
   	pim: 0,
    powerPlayPoints: 0,
    shortHandedPoints: 0,
    gameWinningGoals: 0,
    shots: 0,
    faceOffPct: 0, //no faceoff wins here
    hits: 0,
    blocked: 0,
    wins: 0,
    goalAgainstAverage: 0,
    saves: 0,
    savePercentage: 0,
    shutouts: 0
  };

  if(isNaN(stats.games)){avgStats.games = 0}else{avgStats.games = stats.games}
  if(isNaN(stats.goals)){avgStats.goals = 0}else{avgStats.goals = stats.goals/stats.games}
  if(isNaN(stats.assists)){avgStats.assists = 0}else{avgStats.assists = stats.assists/stats.games}
  if(isNaN(stats.points)){avgStats.points = 0}else{avgStats.points = stats.points/stats.games}
  if(isNaN(stats.plusMinus)){avgStats.plusMinus = 0}else{avgStats.plusMinus = stats.plusMinus/stats.games}
  if(isNaN(stats.pim)){avgStats.pim = 0}else{avgStats.pim = stats.pim/stats.games}
  if(isNaN(stats.powerPlayPoints)){avgStats.powerPlayPoints = 0}else{avgStats.powerPlayPoints = stats.powerPlayPoints/stats.games}
  if(isNaN(stats.shortHandedPoints)){avgStats.shortHandedPoints = 0}else{avgStats.shortHandedPoints = stats.shortHandedPoints/stats.games}
  if(isNaN(stats.gameWinningGoals)){avgStats.gameWinningGoals = 0}else{avgStats.gameWinningGoals = stats.gameWinningGoals/stats.games}
  if(isNaN(stats.shots)){avgStats.shots = 0}else{avgStats.shots = stats.shots/stats.games}
  if(isNaN(stats.faceOffPct)){avgStats.faceOffPct = 0}else{avgStats.faceOffPct = stats.faceOffPct/stats.games}
  if(isNaN(stats.hits)){avgStats.hits = 0}else{avgStats.hits = stats.hits/stats.games}
  if(isNaN(stats.blocked)){avgStats.blocked = 0}else{avgStats.blocked = stats.blocked/stats.games}
  if(isNaN(stats.wins)){avgStats.wins = 0}else{avgStats.wins = stats.wins/stats.games}
  if(isNaN(stats.goalAgainstAverage)){avgStats.goalAgainstAverage = 0}else{avgStats.goalAgainstAverage = stats.goalAgainstAverage}
  if(isNaN(stats.saves)){avgStats.saves = 0}else{avgStats.saves = stats.saves/stats.games}
  if(isNaN(stats.savePercentage)){avgStats.savePercentage = 0}else{avgStats.savePercentage = stats.savePercentage}
  if(isNaN(stats.shutouts)){avgStats.shutouts = 0}else{avgStats.shutouts = stats.shutouts/stats.games}

  return avgStats
};

//function that will add the average stats of the player being added to a team's scoring table depending on the games they have within the date range.
//input should be manager, avgstats, playerGames....for now we'll just focus on MyTeam and just pass avgstats and playerGames
//if manager = 0 it's my team, if = 1 then it's opponent...for now
const addStats = async(manager, avgStats, playerGames) => {
  //start by grabbing the cells
  var cells = document.getElementsByTagName('td'); //this needs to be changed

  //add each of the averaged stat multiplied by the playerGames to each cell
  //cell 0 is My Score, this will be manipulated by another function
  //start by grabbing the contents of the cell, add to it, reprint the cell
  if(manager == 0){
    cells[1].innerHTML = Number(cells[1].innerHTML) + playerGames;
    cells[2].innerHTML = (Number(cells[2].innerHTML) + avgStats.goals*playerGames).toFixed(2);
    cells[3].innerHTML = (Number(cells[3].innerHTML) + avgStats.assists*playerGames).toFixed(2);
    cells[4].innerHTML = (Number(cells[4].innerHTML) + avgStats.points*playerGames).toFixed(2);
    cells[5].innerHTML = (Number(cells[5].innerHTML) + avgStats.plusMinus*playerGames).toFixed(2);
    cells[6].innerHTML = (Number(cells[6].innerHTML) + avgStats.pim*playerGames).toFixed(2);
    cells[7].innerHTML = (Number(cells[7].innerHTML) + avgStats.powerPlayPoints*playerGames).toFixed(2);
    cells[8].innerHTML = (Number(cells[8].innerHTML) + avgStats.shortHandedPoints*playerGames).toFixed(2);
    cells[9].innerHTML = (Number(cells[9].innerHTML) + avgStats.gameWinningGoals*playerGames).toFixed(2);
    cells[10].innerHTML = (Number(cells[10].innerHTML) + avgStats.shots*playerGames).toFixed(2);
    cells[11].innerHTML = (Number(cells[11].innerHTML) + avgStats.faceOffPct*playerGames).toFixed(2);
    cells[12].innerHTML = (Number(cells[12].innerHTML) + avgStats.hits*playerGames).toFixed(2);
    cells[13].innerHTML = (Number(cells[13].innerHTML) + avgStats.blocked*playerGames).toFixed(2);
    cells[14].innerHTML = (Number(cells[14].innerHTML) + avgStats.wins*playerGames).toFixed(2);
    cells[15].innerHTML = avgStats.goalAgainstAverage;
    cells[16].innerHTML = (Number(cells[16].innerHTML) + avgStats.saves*playerGames).toFixed(2);
    cells[17].innerHTML = avgStats.savePercentage;
    cells[18].innerHTML = (Number(cells[18].innerHTML) + avgStats.shutouts*playerGames).toFixed(2);
  }
  if(manager == 1){
    cells[20].innerHTML = Number(cells[20].innerHTML) + playerGames;
    cells[21].innerHTML = (Number(cells[21].innerHTML) + avgStats.goals*playerGames).toFixed(2);
    cells[22].innerHTML = (Number(cells[22].innerHTML) + avgStats.assists*playerGames).toFixed(2);
    cells[23].innerHTML = (Number(cells[23].innerHTML) + avgStats.points*playerGames).toFixed(2);
    cells[24].innerHTML = (Number(cells[24].innerHTML) + avgStats.plusMinus*playerGames).toFixed(2);
    cells[25].innerHTML = (Number(cells[25].innerHTML) + avgStats.pim*playerGames).toFixed(2);
    cells[26].innerHTML = (Number(cells[26].innerHTML) + avgStats.powerPlayPoints*playerGames).toFixed(2);
    cells[27].innerHTML = (Number(cells[27].innerHTML) + avgStats.shortHandedPoints*playerGames).toFixed(2);
    cells[28].innerHTML = (Number(cells[28].innerHTML) + avgStats.gameWinningGoals*playerGames).toFixed(2);
    cells[29].innerHTML = (Number(cells[29].innerHTML) + avgStats.shots*playerGames).toFixed(2);
    cells[30].innerHTML = (Number(cells[30].innerHTML) + avgStats.faceOffPct*playerGames).toFixed(2);
    cells[31].innerHTML = (Number(cells[31].innerHTML) + avgStats.hits*playerGames).toFixed(2);
    cells[32].innerHTML = (Number(cells[32].innerHTML) + avgStats.blocked*playerGames).toFixed(2);
    cells[33].innerHTML = (Number(cells[33].innerHTML) + avgStats.wins*playerGames).toFixed(2);
    cells[34].innerHTML = avgStats.goalAgainstAverage;
    cells[35].innerHTML = (Number(cells[35].innerHTML) + avgStats.saves*playerGames).toFixed(2);
    cells[36].innerHTML = avgStats.savePercentage;
    cells[37].innerHTML = (Number(cells[37].innerHTML) + avgStats.shutouts*playerGames).toFixed(2);
  }
  resetScore();
};

const removeStats = async(manager, avgStats, playerGames) => {
  //start by grabbing the cells
  var cells = document.getElementsByTagName('td'); //this needs to be changed

  //add each of the averaged stat multiplied by the playerGames to each cell
  //cell 0 is My Score, this will be manipulated by another function
  //start by grabbing the contents of the cell, add to it, reprint the cell
  if(manager == 0){
    cells[1].innerHTML = Number(cells[1].innerHTML) - playerGames;
    cells[2].innerHTML = (Number(cells[2].innerHTML) - avgStats.goals*playerGames).toFixed(2);
    cells[3].innerHTML = (Number(cells[3].innerHTML) - avgStats.assists*playerGames).toFixed(2);
    cells[4].innerHTML = (Number(cells[4].innerHTML) - avgStats.points*playerGames).toFixed(2);
    cells[5].innerHTML = (Number(cells[5].innerHTML) - avgStats.plusMinus*playerGames).toFixed(2);
    cells[6].innerHTML = (Number(cells[6].innerHTML) - avgStats.pim*playerGames).toFixed(2);
    cells[7].innerHTML = (Number(cells[7].innerHTML) - avgStats.powerPlayPoints*playerGames).toFixed(2);
    cells[8].innerHTML = (Number(cells[8].innerHTML) - avgStats.shortHandedPoints*playerGames).toFixed(2);
    cells[9].innerHTML = (Number(cells[9].innerHTML) - avgStats.gameWinningGoals*playerGames).toFixed(2);
    cells[10].innerHTML = (Number(cells[10].innerHTML) - avgStats.shots*playerGames).toFixed(2);
    cells[11].innerHTML = (Number(cells[11].innerHTML) - avgStats.faceOffPct*playerGames).toFixed(2);
    cells[12].innerHTML = (Number(cells[12].innerHTML) - avgStats.hits*playerGames).toFixed(2);
    cells[13].innerHTML = (Number(cells[13].innerHTML) - avgStats.blocked*playerGames).toFixed(2);
    cells[14].innerHTML = (Number(cells[14].innerHTML) - avgStats.wins*playerGames).toFixed(2);
    cells[15].innerHTML = Number(cells[15].innerHTML) - avgStats.goalAgainstAverage;
    cells[16].innerHTML = (Number(cells[16].innerHTML) - avgStats.saves*playerGames).toFixed(2);
    cells[17].innerHTML = Number(cells[17].innerHTML) - avgStats.savePercentage;
    cells[18].innerHTML = (Number(cells[18].innerHTML) - avgStats.shutouts*playerGames).toFixed(2);
  }
  if(manager == 1){
    cells[20].innerHTML = Number(cells[20].innerHTML) - playerGames;
    cells[21].innerHTML = (Number(cells[21].innerHTML) - avgStats.goals*playerGames).toFixed(2);
    cells[22].innerHTML = (Number(cells[22].innerHTML) - avgStats.assists*playerGames).toFixed(2);
    cells[23].innerHTML = (Number(cells[23].innerHTML) - avgStats.points*playerGames).toFixed(2);
    cells[24].innerHTML = (Number(cells[24].innerHTML) - avgStats.plusMinus*playerGames).toFixed(2);
    cells[25].innerHTML = (Number(cells[25].innerHTML) - avgStats.pim*playerGames).toFixed(2);
    cells[26].innerHTML = (Number(cells[26].innerHTML) - avgStats.powerPlayPoints*playerGames).toFixed(2);
    cells[27].innerHTML = (Number(cells[27].innerHTML) - avgStats.shortHandedPoints*playerGames).toFixed(2);
    cells[28].innerHTML = (Number(cells[28].innerHTML) - avgStats.gameWinningGoals*playerGames).toFixed(2);
    cells[29].innerHTML = (Number(cells[29].innerHTML) - avgStats.shots*playerGames).toFixed(2);
    cells[30].innerHTML = (Number(cells[30].innerHTML) - avgStats.faceOffPct*playerGames).toFixed(2);
    cells[31].innerHTML = (Number(cells[31].innerHTML) - avgStats.hits*playerGames).toFixed(2);
    cells[32].innerHTML = (Number(cells[32].innerHTML) - avgStats.blocked*playerGames).toFixed(2);
    cells[33].innerHTML = (Number(cells[33].innerHTML) - avgStats.wins*playerGames).toFixed(2);
    cells[34].innerHTML = Number(cells[34].innerHTML) - avgStats.goalAgainstAverage;
    cells[35].innerHTML = (Number(cells[35].innerHTML) - avgStats.saves*playerGames).toFixed(2);
    cells[36].innerHTML = Number(cells[36].innerHTML) - avgStats.savePercentage;
    cells[37].innerHTML = (Number(cells[37].innerHTML) - avgStats.shutouts*playerGames).toFixed(2);
  }
  resetScore();
};

const resetScore = async(e) => {
  var cells = document.getElementsByTagName('td');
  let myScore=0, opponentScore=0;

  for(let i=2;i<19;i++){
    if(Number(cells[i].innerHTML) > Number(cells[i+19].innerHTML)){
      myScore++;
      cells[i].setAttribute('style', 'background-color: green !important');
      cells[i+19].setAttribute('style', 'background-color: black');
    }
    else if(Number(cells[i].innerHTML) < Number(cells[i+19].innerHTML)){
      opponentScore++;
      cells[i].setAttribute('style', 'background-color: black');
      cells[i+19].setAttribute('style', 'background-color: green !important');
    }
    else{
      cells[i].setAttribute('style', 'background-color: black');
      cells[i+19].setAttribute('style', 'background-color: black');
    }
  }
  //goals against average only exception, so reset
  if(Number(cells[15].innerHTML) > Number(cells[34].innerHTML)){
    myScore--, opponentScore++;
    cells[15].setAttribute('style', 'background-color: black');
    cells[34].setAttribute('style', 'background-color: green !important');
  }
  else if(Number(cells[15].innerHTML) < Number(cells[34].innerHTML)){
    myScore++, opponentScore--;
    cells[15].setAttribute('style', 'background-color: green !important');
    cells[34].setAttribute('style', 'background-color: black');
  }
  //if goals against becomes 0, it doesn't count
  if(Number(cells[15].innerHTML) == 0){
    myScore--;
    cells[15].setAttribute('style', 'background-color: black');
  }
  if(Number(cells[34].innerHTML) == 0){
    opponentScore--;
    cells[34].setAttribute('style', 'background-color: black');
  }
  cells[0].innerHTML=myScore;
  cells[19].innerHTML=opponentScore;
  //currently doesn't handle one guy having a GAA and the other having 0, so giving the guy that has a goalie a point....but really....not really a scenario that will happen
}

const triggerEvent = (el, eventName) => {
  const event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, false);
  el.dispatchEvent(event);
};

const emptySelect = (select) => {
  for (let i = select.options.length - 1; i >= 0; i--) {
    select.remove(i);
  }
};

const populateSelect = (select, data, keyFn, textFn) => {
  emptySelect(select);
  data.forEach(item =>
    select.add(new Option(textFn(item), keyFn(item))));
  return select;
};

const populateSeasons = (select) => {
  const year = new Date().getUTCFullYear();
  const seasons = new Array(50).fill('').map((_, index) => ({
    start: year - index - 1,
    end: year - index
  }));
  return populateSelect(select, seasons,
    season => `${season.start}${season.end}`,
    season => `${season.start} - ${season.end}`);
};

const fetchTeams = async () => {
  const response = await fetch(`${api.baseUrl}/teams`);
  const json = await response.json();
  return json.teams.sort((a, b) =>
    a.name.localeCompare(b.name));
};

const fetchSchedule = async (teamId) => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
	const response = await fetch(`${api.baseUrl}/schedule?teamId=${teamId}&startDate=${startDate}&endDate=${endDate}`);
  const json = await response.json();

  let counter = json.totalGames;
  //now we need to scan the json to find the games that already happened or are post poned, which happens in detailedState
  /*
  for (let i=0; i<counter-1;i++){
    console.log(json.dates[counter].games[0].status.detailedState);
    if(json.dates[counter].games[0].status.detailedState!='Scheduled'){
      counter--;
    }
  }*/
  return counter;
};

const fetchRoster = async (teamId) => {
  const response = await fetch(`${api.baseUrl}/teams/${teamId}/roster`);
  const json = await response.json();
  return json.roster.sort((a, b) => {
    const n1 = a.jerseyNumber ? parseInt(a.jerseyNumber, 10) : 100;
    const n2 = b.jerseyNumber ? parseInt(b.jerseyNumber, 10) : 100;
    const res = n1 - n2;
    if (res !== 0) return res;
    return a.person.fullName
      .localeCompare(b.person.fullName, 'en', {
        sensitivity: 'base'
      });
  });
};

const fetchPlayer = async (playerId) => {
  const response = await fetch(`${api.baseUrl}/people/${playerId}`);
  const json = await response.json();
  const [player] = json.people;
  return player;
};

const fetchStats = async (playerId, seasonId) => {
  const response = await fetch(`${api.baseUrl}/people/${playerId}/stats?stats=statsSingleSeason&season=${seasonId}`);
  const json = await response.json();
  let seasonStats;
  try {
    const {
      stats: [{
        splits: [{
          stat
        }]
      }]
    } = json;
    seasonStats = stat;
  } catch (e) {
    seasonStats = {};
  }
  const season = seasonId.match(/^(\d{4})(\d{4})$/).slice(1).join(' – ');
  const {
  	games,
    goals,
    assists,
    points,
   	plusMinus,
   	pim,
    powerPlayPoints,
    shortHandedPoints,
    gameWinningGoals,
    shots,
    faceOffPct, //no faceoff wins here
    hits,
    blocked,
    wins,
    goalAgainstAverage,
    saves,
    savePercentage,
    shutouts
  } = seasonStats;
  return {
    games,
    goals,
    assists,
    points,
   	plusMinus,
   	pim,
    powerPlayPoints,
    shortHandedPoints,
    gameWinningGoals,
    shots,
    faceOffPct, //no faceoff wins here
    hits,
    blocked,
    wins,
    goalAgainstAverage,
    saves,
    savePercentage,
    shutouts
  };
};

const formatPlayerOptionText = (player) =>
  `${player.jerseyNumber || ''} - ${player.person.fullName} (${player.position.abbreviation})`

const onTeamChange = async (e) => {
  const teamId = e.target.value;
  const roster = await fetchRoster(teamId);
  const playerSelect = document.querySelector('select[name="roster"]');

  populateSelect(playerSelect, roster,
    player => player.person.id,
    formatPlayerOptionText);

  triggerEvent(playerSelect, 'change');
};

const onPlayerChange = async (e) => {
  const seasonSelect = document.querySelector('select[name="season"]');
  const playerId = e.target.value;
  const player = await fetchPlayer(playerId);
  triggerEvent(seasonSelect, 'change');
};

const onSeasonChange = async (e) => {
  const playerSelect = document.querySelector('select[name="roster"]');
  const seasonId = e.target.value;
  const stats = await fetchStats(playerSelect.value, seasonId);
};

const addMyPlayer = async (e) => {
  const playerSelect = document.querySelector('select[name="roster"]');
  const seasonSelect = document.querySelector('select[name="season"]');
  const teamSelect = document.querySelector('select[name="teams"]');
  const player = await fetchPlayer(playerSelect.value);
  var playerConflict = false;
  //before any of this gets actioned, we need to check if the player already exists in the list
  for(let i=0; i<myTeam.length; i++){
    if(myTeam[i].fullName === player.fullName){
        playerConflict = true;
        alert("Yo...that player is already on your team jackass");
    }
  }
  for(let i=0; i<myOpponent.length;i++){
    if(myOpponent[i].fullName === player.fullName){
      playerConflict = true;
      alert("K...that player is already on your opponent's team, what kind of league is this?");
    }
  }
  if (!playerConflict){
    myTeam.push(player);
    const playerGames = await fetchSchedule(teamSelect.value);
    const stats = await fetchStats(playerSelect.value, seasonSelect.value);
    const avgStats = await averageOutStats(stats);
      
    //now we need to take the average stats, multiply them by the player's games in the date range and add them to the proper row
    //here we take the player name and how many games they have left (but really just the number of games retured by total games in the fetchSchedule json) and place it into the manager's table
    var tbl = document.getElementById('tblMyTeam'),
    row = tbl.insertRow(tbl.rows.lentgh);
    var cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2);
    let playerName = document.createTextNode(player.fullName);
    cell1.appendChild(playerName);
    cell2.innerHTML=playerGames;
    cell3.innerHTML='<input type="button" value="Remove" onclick="removePlayer(0,this)"/>'
    //need a button to remove player
      
    //addStats(manager, stats, playerGames) <-- ideal call here, but we'll have to make due with addStats(avgStats, playergGames) for now since I don't have a manager object being handled by the buttons yet
    addStats(0, avgStats, playerGames);
    //updateScore()
  }
};

const addVSPlayer = async (e) => {
  let playerSelect = document.querySelector('select[name="roster"]');
  let seasonSelect = document.querySelector('select[name="season"]');
  let teamSelect = document.querySelector('select[name="teams"]');
  let player = await fetchPlayer(playerSelect.value);
  let playerConflict = false;
  //before any of this gets actioned, we need to check if the player already exists in the list
  for(let i=0; i<myTeam.length; i++){
    if(myTeam[i].fullName === player.fullName){
        playerConflict = true;
        alert("Yo...that player is already on your team jackass");
    }
  }
  for(let i=0; i<myOpponent.length;i++){
    if(myOpponent[i].fullName === player.fullName){
      playerConflict = true;
      alert("K...that player is already on your opponent's team, what kind of league is this?");
    }
  }
  if (!playerConflict){
    myOpponent.push(player);
    let playerGames = await fetchSchedule(teamSelect.value);
    let stats = await fetchStats(playerSelect.value, seasonSelect.value);
    let avgStats = await averageOutStats(stats);
    console.log(avgStats);
      
    //now we need to take the average stats, multiply them by the player's games in the date range and add them to the proper row
    //here we take the player name and how many games they have left (but really just the number of games retured by total games in the fetchSchedule json) and place it into the manager's table
    let tbl = document.getElementById('tblVSTeam'),
    row = tbl.insertRow(tbl.rows.lentgh);
    let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2);
    let playerName = document.createTextNode(player.fullName);
    cell1.appendChild(playerName);
    cell2.innerHTML=playerGames;
    cell3.innerHTML='<input type="button" value="Remove" onclick="removePlayer(1, this)"/>'
      
    //addStats(manager, stats, playerGames) <-- ideal call here, but we'll have to make due with addStats(avgStats, playergGames) for now since I don't have a manager object being handled by the buttons yet
    addStats(1, avgStats, playerGames);
    //updateScore()
  }
};

const removePlayer = async(manager, btn) => {
  let row = btn.parentNode.parentNode;
  let playerName = row.cells[0].innerHTML;
  let gamesLeft = row.cells[1].innerHTML;
  let playerRemoved;

  if(manager==0){
    for(let i=0; i<myTeam.length;i++){
      if(myTeam[i].fullName===playerName){
        playerRemoved=myTeam[i];
        myTeam.splice(i, 1);
        row.parentNode.removeChild(row);
      }
    }
  }else{
    for(let i=0; i<myOpponent.length;i++){
      if(myOpponent[i].fullName===playerName){
        playerRemoved=myOpponent[i];
        myOpponent.splice(i, 1);
        row.parentNode.removeChild(row);
      }
    }
  }
  let seasonSelect = document.querySelector('select[name="season"]');
  let stats = await fetchStats(playerRemoved.id, seasonSelect.value);
  let avgStats = await averageOutStats(stats);
  removeStats(manager, avgStats, gamesLeft);
}


const main = async () => {
  const nhl = document.forms['nhl'];
  const teamSelect = nhl['teams'];
  const playerSelect = nhl['roster'];
  const seasonSelect = nhl['season'];

  //DATE
  //consider setting drop down with preset weeks to avoid a whole bunch of error trapping
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  var year = new Date().getFullYear(), month = new Date().getMonth() + 1, day = new Date().getDate();
  var year2, month2, day2;
  //formatting for input
  if(day < 10){
    day = `0${day}`;
  }
  if(month <10){
    month = `0${month}`;
  }
  startDate.value = `${year}-${month}-${day}`;
  year = Number(year), month = Number(month), day = Number(day); //convert to number for easy math in the handler
  //endDate handler
  if(month == 12 && day > 24){
    year2 = year+1;
    month2 = month+1;
    day2=-1*(31-day-6);
  }else if((month == 01 || month == 03 || month == 05 || month == 07 || month == 08 || month == 10) && day > 24){
    month2=month+1;
    day2=-1*(31-day-6);
  }else if(month == 02 && day > 21){
    month2=month+1;
    day2=-1*(28-day-6);
  }else if(month == 04 || month == 06 || month == 09 || month == 11 && day >23){
    month2=month+1;
    day2=-1*(30-day-6);
  }else{
    day2=day+7;
    month2 = month;
    year2 = year;
  }
  //format for input
  if(day2 < 10){
    day2 = `0${day2}`;
  }
  if(month2 <10){
    month2 = `0${month2}`;
  }
  endDate.value = `${year2}-${month2}-${day2}`;

  populateSeasons(seasonSelect);

  const teams = await fetchTeams();

  populateSelect(teamSelect, teams, team => team.id, team => team.name);

  teamSelect.addEventListener('change', onTeamChange);
  playerSelect.addEventListener('change', onPlayerChange);
  seasonSelect.addEventListener('change', onSeasonChange);
  //startDate.addEventListener('change',);
  //endDate.addEventListener('change',);
  

  teamSelect.value = 14;           // Tampa Bay
  seasonSelect.value = '20212022'; 

  triggerEvent(teamSelect, 'change');
};

main();
