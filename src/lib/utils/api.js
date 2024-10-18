import '$lib/utils/api.js'

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

// Fetch fixtures for a specific league and season, with optional parameters
export async function fetchFixtures(leagueId, season, additionalParams = {}) {
  const params = { league: leagueId, season: season, ...additionalParams };
  return fetchAPI('fixtures', params);
}

export async function fetchOdds(fixtureId) {
  return fetchAPI('odds', { fixture: fixtureId, bet: 1 });
}

export async function fetchLeagues() {
  return fetchAPI('leagues');
}
