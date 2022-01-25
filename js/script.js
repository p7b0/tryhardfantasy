const api = {
  baseUrl: 'https://statsapi.web.nhl.com/api/v1'
};

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
    season => `${season.start} – ${season.end}`);
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
  `${player.jerseyNumber || ''} – ${player.person.fullName} (${player.position.abbreviation})`

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
  const stats = await fetchStats(playerSelect.value, seasonSelect.value);
  
  var tbl = document.getElementById('tblMyTeam'),
    row = tbl.insertRow(tbl.rows.lentgh);

  var cell1 = row.insertCell(0),
    cell2 = row.insertCell(1);

  let playerName = document.createTextNode(player.fullName);
  cell1.appendChild(playerName);
  let playerGames = await fetchSchedule(teamSelect.value);
  cell2.innerHTML=playerGames;
}

const addVSPlayer = async (e) => {
 const playerSelect = document.querySelector('select[name="roster"]');
 const seasonSelect = document.querySelector('select[name="season"]');
 const teamSelect = document.querySelector('select[name="teams"]');
  const player = await fetchPlayer(playerSelect.value);
  const stats = await fetchStats(playerSelect.value, seasonSelect.value);
  
  var tbl = document.getElementById('tblVSTeam'),
    row = tbl.insertRow(tbl.rows.lentgh);

  var cell1 = row.insertCell(0),
    cell2 = row.insertCell(1);

  let playerName = document.createTextNode(player.fullName);
  cell1.appendChild(playerName);
  let playerGames = await fetchSchedule(teamSelect.value);
  cell2.innerHTML=playerGames;
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
