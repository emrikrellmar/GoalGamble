<svelte:head>
  <title>Leaderboards - GoalGamble</title>
</svelte:head>

<script>
  import { onMount } from 'svelte'; // För att köra kod när komponenten har laddats
  import { supabase } from '$lib/supabase';
  
  // Variabler för de tre olika leaderboards
  let creditLeaders = [];
  let winLeaders = [];
  let betLeaders = [];
  let loading = true; 
  let error = null;
  
  // Begränsar antalet resultat i varje leaderboard
  const limit = 5;
  
  // Körs när komponenten har renderats
  onMount(async () => {
    try {
      loading = true;
      
      // Hämtar topplista baserad på credits
      const { data: creditsData, error: creditsError } = await supabase
        .from('profiles')
        .select('username, credits, total_bets, total_wins')
        .order('credits', { ascending: false })
        .limit(limit);
      
      if (creditsError) throw creditsError;
      creditLeaders = creditsData;
      
      // Hämtar topplista baserad på vinster
      const { data: winsData, error: winsError } = await supabase
        .from('profiles')
        .select('username, credits, total_bets, total_wins')
        .order('total_wins', { ascending: false })
        .limit(limit);
      
      if (winsError) throw winsError;
      winLeaders = winsData;
      
      // Hämtar topplista baserad på antal satsningar
      const { data: betsData, error: betsError } = await supabase
        .from('profiles')
        .select('username, credits, total_bets, total_wins')
        .order('total_bets', { ascending: false })
        .limit(limit);
      
      if (betsError) throw betsError;
      betLeaders = betsData;
      
    } catch (e) {
      // Felhantering (tom i originalkoden)
    } finally {
      loading = false;
    }
  });
  
  // Beräknar vinstprocent
  function calculateWinRate(totalWins, totalBets) {
    if (!totalBets) return '0%';
    return ((totalWins / totalBets) * 100).toFixed(1) + '%';
  }
  
  // Formaterar nummer med tusentalsavgränsare
  function formatNumber(number) {
    return number?.toLocaleString() || '0';
  }
</script>

<div class="leaderboard-page">
  <div class="leaderboard-header">
    <h1>Leaderboards.</h1>
    <p class="description">See how you stack up against other players in GoalGamble!</p>
  </div>
  
  {#if loading}
    <!-- Laddningsindikator -->
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading leaderboards...</p>
    </div>
  {:else if error}
    <!-- Felmeddelande -->
    <div class="error-message">
      <p>Error loading leaderboards: {error}</p>
      <p>Please try again later or <a href="/login">log in</a> if you haven't already.</p>
    </div>
  {:else}
    <!-- Visar de tre topplistorna i ett rutnät -->
    <div class="leaderboards-grid">
      <!-- Topplista för credits -->
      <div class="leaderboard-card">
        <div class="leaderboard-title">
          <h2>Most Credits</h2>
          <span class="title-icon">💰</span>
        </div>
        
        {#if creditLeaders.length === 0}
          <div class="empty-state">
            <p>No data available yet!</p>
          </div>
        {:else}
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {#each creditLeaders as user, index}
                <tr class={index === 0 ? 'top-ranked' : ''}>
                  <td class="rank">
                    {#if index === 0}
                      <span class="crown">👑</span>
                    {:else}
                      #{index + 1}
                    {/if}
                  </td>
                  <td class="username">{user.username}</td>
                  <td class="value credits">{formatNumber(user.credits)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
      
      <!-- Topplista för vinster -->
      <div class="leaderboard-card">
        <div class="leaderboard-title">
          <h2>Most Wins</h2>
          <span class="title-icon">🏆</span>
        </div>
        
        {#if winLeaders.length === 0}
          <div class="empty-state">
            <p>No data available yet!</p>
          </div>
        {:else}
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {#each winLeaders as user, index}
                <tr class={index === 0 ? 'top-ranked' : ''}>
                  <td class="rank">
                    {#if index === 0}
                      <span class="crown">👑</span>
                    {:else}
                      #{index + 1}
                    {/if}
                  </td>
                  <td class="username">{user.username}</td>
                  <td class="value wins">{formatNumber(user.total_wins || 0)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
      
      <!-- Topplista för aktivitet (antal satsningar) -->
      <div class="leaderboard-card">
        <div class="leaderboard-title">
          <h2>Most Active</h2>
          <span class="title-icon">🎲</span>
        </div>
        
        {#if betLeaders.length === 0}
          <div class="empty-state">
            <p>No data available yet!</p>
          </div>
        {:else}
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Total Bets</th>
              </tr>
            </thead>
            <tbody>
              {#each betLeaders as user, index}
                <tr class={index === 0 ? 'top-ranked' : ''}>
                  <td class="rank">
                    {#if index === 0}
                      <span class="crown">👑</span> <!-- Krona ifall första plats -->
                    {:else}
                      #{index + 1}
                    {/if}
                  </td>
                  <td class="username">{user.username}</td>
                  <td class="value bets">{formatNumber(user.total_bets || 0)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .leaderboard-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .leaderboard-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .leaderboard-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #3b82f6, #2563eb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .description {
    color: #64748b;
    font-size: 1.1rem;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: #64748b;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(59, 130, 246, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-message {
    text-align: center;
    padding: 3rem;
    color: #ef4444;
    background: #fee2e2;
    border-radius: 1rem;
  }
  
  .leaderboards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .leaderboard-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .leaderboard-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .leaderboard-title {
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .leaderboard-title h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  
  .title-icon {
    font-size: 1.5rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #94a3b8;
    font-style: italic;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background: #f8fafc;
  }
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #64748b;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
    color: goldenrod;
  }
  
  .username {
    font-weight: 500;
    color: #1e293b;
    width: 60%;
  }
  
  .value {
    font-weight: 600;
    text-align: right;
    width: 25%;
  }
  
  .credits {
    color: #3b82f6;
  }
  
  .wins {
    color: #10b981;
  }
  
  .bets {
    color: #8b5cf6;
  }
  
  .leaderboard-footer {
    text-align: center;
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f1f5f9;
    border-radius: 1rem;
  }
  
  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .leaderboard-header h1 {
      font-size: 2rem;
    }
    
    .leaderboards-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 480px) {
    .leaderboard-page {
      padding: 1rem 0.5rem;
    }
    
    .leaderboard-header h1 {
      font-size: 1.75rem;
    }
    
    .description {
      font-size: 1rem;
    }
    
    th, td {
      padding: 0.75rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .crown {
      font-size: 1rem;
    }
  }
</style>