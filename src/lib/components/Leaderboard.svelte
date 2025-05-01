<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    
    export let limit = 5;  
    export let sortBy = 'credits';  
    
    let leaderboardData = [];
    let loading = true;
    let error = null;
    
    onMount(async () => {
      try {
        loading = true;
        
        const { data, error: queryError } = await supabase
          .from('profiles')
          .select('username, credits, total_bets, total_wins')
          .order(sortBy, { ascending: false })
          .limit(limit);
        
        if (queryError) throw queryError;
        
        leaderboardData = data;
      } catch (e) {
        error = e.message;
      } finally {
        loading = false;
      }
    });
    
    function calculateWinRate(totalWins, totalBets) {
      if (!totalBets) return '0%';
      return ((totalWins / totalBets) * 100).toFixed(1) + '%';
    }
  </script>
  
  <div class="leaderboard">
    {#if loading}
      <div class="loading">
        <p>Loading leaderboard...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>Sign up or log in to see leaderboard</p>
      </div>
    {:else if leaderboardData.length === 0}
      <div class="empty">
        <p>
          <a href="/signup">Sign up</a> or 
          <a href="/login">log in</a> to see the leaderboard!
        </p>
      </div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Credits</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {#each leaderboardData as user, index}
            <tr class={index === 0 ? 'top-ranked' : ''}>
              <td class="rank">
                {#if index === 0}
                  <span class="crown">👑</span>
                {:else}
                  #{index + 1}
                {/if}
              </td>
              <td class="username">{user.username}</td>
              <td class="credits">{user.credits.toLocaleString()}</td>
              <td class="win-rate">
                {calculateWinRate(user.total_wins || 0, user.total_bets || 0)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  
  <style>
    a {
      color: rgba(19, 19, 236, 0.568);
    }

    .leaderboard {
      width: 100%;
      overflow: hidden;
      border-radius: 0.5rem;
    }
    
    .loading, .error, .empty {
      text-align: center;
      padding: 2rem;
      color: #6e6a6a;
    }
    
    .error {
      color: #ef4444;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }
    
    thead {
      background-color: #f8fafc;
    }
    
    th {
      padding: 1rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.75rem;
    }
    
    td {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
    }
    
    tbody tr {
      transition: background-color 0.2s;
    }
    
    tbody tr:hover {
      background-color: #f1f5f9;
    }
    
    .top-ranked {
      background-color: #eff6ff;
    }
    
    .top-ranked:hover {
      background-color: #dbeafe;
    }
    
    .rank {
      font-weight: 600;
      color: #334155;
      width: 15%;
    }
    
    .crown {
      font-size: 1.25rem;
    }
    
    .username {
      font-weight: 500;
      color: #1e293b;
      width: 35%;
    }
    
    .credits {
      font-weight: 600;
      color: #3b82f6;
      width: 25%;
    }
    
    .win-rate {
      color: #0f766e;
      width: 25%;
    }
    
    @media (max-width: 640px) {
      table {
        font-size: 0.75rem;
      }
      
      th, td {
        padding: 0.75rem 0.5rem;
      }
      
      .crown {
        font-size: 1rem;
      }
    }
  </style>