const api = {
  baseUrl: 'https://statsapi.web.nhl.com/api/v1'
};

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
  /*
  let avgStats = {
    games: stats.games,
    goals: stats.goals/stats.games,
    assists: stats.assists/stats.games,
    points: stats.points/stats.games,
   	plusMinus: stats.plusMinus/stats.games,
   	pim: stats.pim/stats.games,
    powerPlayPoints: stats.powerPlayPoints/stats.games,
    shortHandedPoints: stats.shortHandedPoints/stats.games,
    gameWinningGoals: stats.gameWinningGoals/stats.games,
    shots: stats.shots/stats.games,
    faceOffPct: stats.faceOffPct, //no faceoff wins here
    hits: stats.hits/stats.games,
    blocked: stats.blocked/stats.games,
    wins: stats.wins/stats.games,
    goalAgainstAverage: stats.goalAgainstAverage,
    saves: stats.saves/stats.games,
    savePercentage: stats.savePercentage,
    shutouts: stats.shutouts/stats.games
  }*/
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
  }

  if(isNaN(stats.games)){avgStats.games = 0}else{avgStats.games = stats.games}
  if(isNaN(stats.goals)){avgStats.goals = 0}else{avgStats.goals = stats.goals/stats.games}
  if(isNaN(stats.assists)){avgStats.assists = 0}else{avgStats.assists = stats.assists/stats.games}
  //continue this, it works

  return avgStats
}

//function that will add the average stats of the player being added to a team's scoring table depending on the games they have within the date range.
//input should be manager, avgstats, playerGames....for now we'll just focus on MyTeam and just pass avgstats and playerGames
const addStats = async(avgStats, playerGames) => {
  //start by grabbing the cells
  var cells = document.getElementsByTagName('td');

  //add each of the averaged stat multiplied by the playerGames to each cell
  //cell 0 is My Score, this will be manipulated by another function
  //start by grabbing the contents of the cell, add to it, reprint the cell
  cells[1].innerHTML = Number(cells[1].innerHTML) + playerGames;
  cells[2].innerHTML = Math.round(Number(cells[2].innerHTML) + avgStats.goals*playerGames);
  cells[3].innerHTML = Math.round(Number(cells[3].innerHTML) + avgStats.assists*playerGames);
//continue this, it works









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
}

const populateSelect = (select, data, keyFn, textFn) => {
  emptySelect(select);
  data.forEach(item =>
    select.add(new Option(textFn(item), keyFn(item))));
  return select;
};

/*
const populateForm = (form, fields) =>
  Object.entries(fields).forEach(([key, value]) =>
    form[key].value = value);
*/

const populateSeasons = (select) => {
  const year = new Date().getUTCFullYear();
  const seasons = new Array(50).fill('').map((_, index) => ({
    start: year - index - 1,
    end: year - index
  }));
  return populateSelect(select, seasons,
    season => `${season.start}${season.end}`,
    season => `${season.start} - ${season.end}`);
}

const fetchTeams = async () => {
  const response = await fetch(`${api.baseUrl}/teams`);
  const json = await response.json();
  return json.teams.sort((a, b) =>
    a.name.localeCompare(b.name));
}

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
}

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
}

const fetchPlayer = async (playerId) => {
  const response = await fetch(`${api.baseUrl}/people/${playerId}`);
  const json = await response.json();
  const [player] = json.people;
  return player;
}

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
}

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

  /*
  populateForm(document.forms['player-info'], {
    'first-name': player.firstName,
    'last-name': player.lastName,
    'birth-date': player.birthDate,
    'current-team': player.currentTeam.name,
    'primary-number': player.primaryNumber,
    'primary-position': player.primaryPosition.type
  });*/

  triggerEvent(seasonSelect, 'change');
};

const onSeasonChange = async (e) => {
  const playerSelect = document.querySelector('select[name="roster"]');
  const seasonId = e.target.value;
  const stats = await fetchStats(playerSelect.value, seasonId);

  /*
  populateForm(document.forms['player-stats'], {
    'stat-season': stats.season,
    'stat-shots': stats.shots || 'N/A',
    'stat-assists': stats.assists || 'N/A',
    'stat-goals': stats.goals || 'N/A'
  });*/
}

const addMyPlayer = async (e) => {
  const playerSelect = document.querySelector('select[name="roster"]');
  const seasonSelect = document.querySelector('select[name="season"]');
  const teamSelect = document.querySelector('select[name="teams"]');
   const player = await fetchPlayer(playerSelect.value);
   const playerGames = await fetchSchedule(teamSelect.value);//something is wrong with this, it seems like it's holding on to numbers when teams change
   const stats = await fetchStats(playerSelect.value, seasonSelect.value);
   const avgStats = await averageOutStats(stats);
 
   //now we need to take the average stats, multiply them by the player's games in the date range and add them to the proper row
   //here we take the player name and how many games they have left (but really just the number of games retured by total games in the fetchSchedule json) and place it into the manager's table
   var tbl = document.getElementById('tblMyTeam'),
     row = tbl.insertRow(tbl.rows.lentgh);
   var cell1 = row.insertCell(0),
     cell2 = row.insertCell(1);
   let playerName = document.createTextNode(player.fullName);
   cell1.appendChild(playerName);
   cell2.innerHTML=playerGames;
   //need a button to remove player
   
   //addStats(manager, stats, playerGames) <-- ideal call here, but we'll have to make due with addStats(avgStats, playergGames) for now since I don't have a manager object being handled by the buttons yet
  addStats(avgStats, playerGames);
   //updateScore()
}

//HOLD DEV ON THIS BUTTON, WORK ON addMyPlayer first, and then migrate changes to this button funtion...eventually we will only have one of theses
//really should have 1 addPlayer and pass in the manager you add the player to, when you do, rebuild the functions that manipulate the html to take a manager object
const addVSPlayer = async (e) => {
 const playerSelect = document.querySelector('select[name="roster"]');
 const seasonSelect = document.querySelector('select[name="season"]');
 const teamSelect = document.querySelector('select[name="teams"]');
  const player = await fetchPlayer(playerSelect.value);
  const playerGames = await fetchSchedule(teamSelect.value);
  const stats = await fetchStats(playerSelect.value, seasonSelect.value);
  const avgStats = await averageOutStats(stats);

  //now we need to take the average stats, multiply them by the player's games in the date range and add them to the proper row
  //here we take the player name and how many games they have left (but really just the number of games retured by total games in the fetchSchedule json) and place it into the manager's table
  var tbl = document.getElementById('tblVSTeam'),
    row = tbl.insertRow(tbl.rows.lentgh);
  var cell1 = row.insertCell(0),
    cell2 = row.insertCell(1);
  let playerName = document.createTextNode(player.fullName);
  cell1.appendChild(playerName);
  cell2.innerHTML=playerGames;
  //need a button to remove player

  //addStats(manager, stats, playerGames) <-- ideal call here, but we'll have to make due with addStats(avgStats, playergGames) for now since I don't have a manager object being handled by the buttons yet

  //updateScore()
}

const main = async () => {
  const nhl = document.forms['nhl'];
  const teamSelect = nhl['teams'];
  const playerSelect = nhl['roster'];
  const seasonSelect = nhl['season'];
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
 

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
