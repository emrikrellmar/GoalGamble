<script>
    import { bets } from '$lib/stores/bets';
    export let matches = [];
  
    function placeBet(match, type, odds) {
      bets.update(currentBets => [
        ...currentBets,
        { matchId: match.id, homeTeam: match.homeTeam, awayTeam: match.awayTeam, type, odds, stake: 10 }
      ]);
    }
  </script>
  
  <div class="match-list">
    <h2>Upcoming Matches</h2>
    {#each matches as match}
      <div class="match">
        <span>{match.homeTeam} vs {match.awayTeam}</span>
        <span>Date: {new Date(match.date).toLocaleString()}</span>
        <div class="odds">
          {#each match.odds as odd}
            <button on:click={() => placeBet(match, odd.value, parseFloat(odd.odd))}>
              {odd.value} ({odd.odd})
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
  
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