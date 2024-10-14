import { fetchLeagues, fetchFixtures, fetchOdds } from '$lib/utils/api';

export async function load() {
  try {
    const leaguesData = await fetchLeagues();
    const leagues = leaguesData.response.slice(0, 5); // Limit to 5 leagues for this example

    const fixturesPromises = leagues.map(league => 
      fetchFixtures(league.league.id, '2023')
    );
    const fixturesData = await Promise.all(fixturesPromises);

    const fixtures = fixturesData.flatMap(data => 
      data.response.slice(0, 3)  // Limit to 3 fixtures per league
    );

    const oddsPromises = fixtures.map(fixture => 
      fetchOdds(fixture.fixture.id)
    );
    const oddsData = await Promise.all(oddsPromises);

    const matchesWithOdds = fixtures.map((fixture, index) => ({
      id: fixture.fixture.id,
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      date: fixture.fixture.date,
      odds: oddsData[index].response[0]?.bookmakers[0]?.bets[0]?.values || []
    }));

    return {
      leagues: leagues.map(league => ({
        id: league.league.id,
        name: league.league.name,
        country: league.country.name
      })),
      matches: matchesWithOdds
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      leagues: [],
      matches: []
    };
  }
}