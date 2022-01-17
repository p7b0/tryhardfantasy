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
  
  const populateForm = (form, fields) =>
    Object.entries(fields).forEach(([key, value]) =>
      form[key].value = value);
  
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
  
  const fetchTeams = async() => {
    const response = await fetch(`${api.baseUrl}/teams`);
    const json = await response.json();
    return json.teams.sort((a, b) =>
      a.name.localeCompare(b.name));
  }
  
  const fetchRoster = async(teamId) => {
    const response = await fetch(`${api.baseUrl}/teams/${teamId}/roster`);
    const json = await response.json();
    return json.roster.sort((a, b) => {
      const n1 = a.jerseyNumber ? parseInt(a.jerseyNumber, 10) : 100;
      const n2 = b.jerseyNumber ? parseInt(b.jerseyNumber, 10) : 100;
      const res = n1 - n2;
      if (res !== 0) return res;
      return a.person.fullName
        .localeCompare(b.person.fullName, 'en', { sensitivity: 'base' });
    });
  }
  
  const fetchPlayer = async(playerId) => {
    const response = await fetch(`${api.baseUrl}/people/${playerId}`);
    const json = await response.json();
    const [player] = json.people;
    return player;
  }
  
  const fetchStats = async(playerId, seasonId) => {
    const response = await fetch(`${api.baseUrl}/people/${playerId}/stats?stats=statsSingleSeason&season=${seasonId}`);
    const json = await response.json();
    let seasonStats;
    try {
      const { stats: [{ splits: [{ stat }] }] } = json;
      seasonStats = stat;
    } catch (e) {
      seasonStats = {};
    }
    const season = seasonId.match(/^(\d{4})(\d{4})$/).slice(1).join(' – ');
    const { shots, assists, goals, timeOnIce } = seasonStats;
    return { season, shots, assists, goals, timeOnIce };
  }
  
  const formatPlayerOptionText = (player) =>
    `${player.jerseyNumber || ''} – ${player.person.fullName} (${player.position.abbreviation})`
  
  const onTeamChange = async(e) => {
    const teamId = e.target.value;
    const roster = await fetchRoster(teamId);
    const playerSelect = document.querySelector('select[name="roster"]');
  
    populateSelect(playerSelect, roster,
      player => player.person.id,
      formatPlayerOptionText);
  
    triggerEvent(playerSelect, 'change');
  };
  
  const onPlayerChange = async(e) => {
    const seasonSelect = document.forms['nhl']['season'];
    const playerId = e.target.value;
    const player = await fetchPlayer(playerId);
  
    populateForm(document.forms['player-info'], {
      'first-name': player.firstName,
      'last-name': player.lastName,
      'birth-date': player.birthDate,
      'current-team': player.currentTeam.name,
      'primary-number': player.primaryNumber,
      'primary-position': player.primaryPosition.type
    });
  
    triggerEvent(seasonSelect, 'change');
  };
  
  const onSeasonChange = async(e) => {
    const playerSelect = document.querySelector('select[name="roster"]');
    const seasonId = e.target.value;
    const stats = await fetchStats(playerSelect.value, seasonId);
  
    populateForm(document.forms['player-stats'], {
      'stat-season': stats.season,
      'stat-shots': stats.shots || 'N/A',
      'stat-assists': stats.assists || 'N/A',
      'stat-goals': stats.goals || 'N/A'
    });
  }
  
  const main = async() => {
    const nhl = document.forms['nhl'];
    const teamSelect = nhl['teams'];
    const playerSelect = nhl['roster'];
    const seasonSelect = nhl['season'];
  
    populateSeasons(seasonSelect);
  
    const teams = await fetchTeams();
  
    populateSelect(teamSelect, teams, team => team.id, team => team.name);
  
    teamSelect.addEventListener('change', onTeamChange);
    playerSelect.addEventListener('change', onPlayerChange);
    seasonSelect.addEventListener('change', onSeasonChange);
  
    teamSelect.value = 14;           // Tampa Bay
    seasonSelect.value = '20192020'; // 2019-2020
  
    triggerEvent(teamSelect, 'change');
  };
  
  main();