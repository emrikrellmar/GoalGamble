<script>
  // Importing the bets store and receiving the matches prop
  import { bets } from '$lib/stores/bets';
  export let matches = [];

  import { fetchFixtures, fetchOdds } from '$lib/utils/api';

export async function load() {
  try {
    // Fetch the next 10 upcoming Premier League fixtures
    const fixturesData = await fetchFixtures(39, '2023', { next: 10 }); // League ID 39 for Premier League
    const fixtures = fixturesData.response;

    // Fetch odds for each fixture
    const oddsPromises = fixtures.map(fixture =>
      fetchOdds(fixture.fixture.id)
    );
    const oddsData = await Promise.all(oddsPromises);

    // Combine fixture and odds data
    const matchesWithOdds = fixtures.map((fixture, index) => ({
      id: fixture.fixture.id,
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      date: fixture.fixture.date,
      odds: oddsData[index].response[0]?.bookmakers[0]?.bets[0]?.values || []
    }));

    // Return the matches data to the component
    return {
      matches: matchesWithOdds
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      matches: []
    };
  }
}


  // Function to handle placing a bet
  function placeBet(match, type, odds) {
    bets.update(currentBets => [
      ...currentBets,
      {
        matchId: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        type,
        odds,
        stake: 10 // Set a default stake amount
      }
    ]);
  }
</script>

<div class="match-list">
  <h2>Upcoming Premier League Matches</h2>

  <!-- Loop through matches prop to display each match -->
  {#each matches as match}
    <div class="match">
      <!-- Display match details (home vs away, date) -->
      <span>{match.homeTeam} vs {match.awayTeam}</span>
      <span>Date: {new Date(match.date).toLocaleString()}</span>

      <!-- Display the betting odds for each match -->
      <div class="odds">
        {#each match.odds as odd}
          <!-- Button for each betting option -->
          <button on:click={() => placeBet(match, odd.value, parseFloat(odd.odd))}>
            {odd.value} ({odd.odd})
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>

<!-- Styles -->
<style>
  .match-list {
    background: #f4f4f4;
    padding: 1rem;
    border-radius: 4px;
  }

  .match {
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: #fff;
    border-radius: 4px;
  }

  .odds {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  button {
    padding: 0.25rem 0.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #45a049;
  }
</style>
