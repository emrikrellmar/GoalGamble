const API_KEY = '17591892a900c7676cacf111d27ef8d6';
const API_BASE_URL = 'https://v3.football.api-sports.io';

async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchLeagues() {
  return fetchAPI('leagues');
}

export async function fetchFixtures(leagueId, season) {
  return fetchAPI('fixtures', { league: leagueId, season: season });
}

export async function fetchOdds(fixtureId) {
  return fetchAPI('odds', { fixture: fixtureId, bet: 1 });
}