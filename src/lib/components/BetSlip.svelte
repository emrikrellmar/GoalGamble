<script>
    import { bets } from '$lib/stores/bets';
    import { user } from '$lib/stores/user';
  
    function placeBets() {
      const totalStake = $bets.reduce((sum, bet) => sum + bet.stake, 0);
      if (totalStake > $user.balance) {
        alert("Not enough balance!");
        return;
      }
      
      const winAmount = $bets.reduce((sum, bet) => sum + bet.stake * bet.odds, 0);
      user.update(u => ({ ...u, balance: u.balance - totalStake + winAmount }));
      bets.set([]);
      alert(`Bets placed! You won ${winAmount.toFixed(2)} coins!`);
    }
  
    function removeBet(index) {
      bets.update(currentBets => currentBets.filter((_, i) => i !== index));
    }
  </script>
  
  <div class="bet-slip">
    <p>Your Balance: {$user.balance.toFixed(2)} coins</p>
    <h2>Bet Slip</h2>
    {#if $bets.length === 0}
      <p>Your bet slip is empty.</p>
    {:else}
      <ul>
        {#each $bets as bet, index}
          <li>
            <span>{bet.homeTeam} vs {bet.awayTeam}</span>
            <span>Bet: {bet.type}, Odds: {bet.odds}, Stake: {bet.stake}</span>
            <button on:click={() => removeBet(index)}>Remove</button>
          </li>
        {/each}
      </ul>
      <button on:click={placeBets}>Place Bets</button>
    {/if}
  </div>
  
  <style>

    .bet-slip {
      background: #f4f4f4;
      padding: 0.5rem;
    }
  
    ul {
      list-style-type: none;
      padding: 0;
    }
  
    li {
      margin-bottom: 0.5rem;
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