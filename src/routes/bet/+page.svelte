<svelte:head>
  <title>Bet - GoalGamble</title>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { authStore } from '$lib/stores/auth';
  
  export let data;
  
  let profile = null;
  let matches = data?.matches || [];
  let pendingBets = data?.pendingBets || [];
  let completedBets = data?.completedBets || [];
  let isLoggedIn = false;

  let activeGame = 'coinflip'; 
  let showRules = false;
  
  let busCards = [];
  let playerPosition = 0;
  let rideTheBusActive = false;
  let rideTheBusStage = 'start';
  let betAmount = 100;
  let currentGuess = '';
  let previousCard = null;
  let gameMessage = '';
  let gameHistory = [];
  let potentialWinnings = 0;
  
  let coinSide = '';
  let coinFlipping = false;
  let coinBetAmount = 50;
  let coinBetChoice = 'heads';
  
  let diceValue = 1;
  let diceRolling = false;
  let diceBetAmount = 50;
  let diceBetChoice = 'high'; 
  let diceSpecificNumber = 6;
  let diceBetType = 'highlow'; 

  $: isLoggedIn = !!$authStore.user;
  $: if ($authStore.user && !profile) {
    fetchUserProfile($authStore.user.id);
  }
  
  function setActiveGame(game) {
    activeGame = game;
    showRules = false;
    resetGames();
  }
  
  function toggleRules() {
    showRules = !showRules;
  }
  
  function resetGames() {
    busCards = [];
    playerPosition = 0;
    rideTheBusActive = false;
    rideTheBusStage = 'start';
    betAmount = 100;
    currentGuess = '';
    previousCard = null;
    gameMessage = '';
    gameHistory = [];
    potentialWinnings = 0;
    
    coinSide = '';
    coinFlipping = false;
    coinBetAmount = 50;
    
    diceValue = 1;
    diceRolling = false;
    diceBetAmount = 50;
    diceBetChoice = 'high';
  }

  async function initializeProfileStats() {
  if (!profile) return;
  
  if (profile.total_bets === null || profile.total_wins === null) {    
    const { error } = await supabase
      .from('profiles')
      .update({
        total_bets: profile.total_bets || 0,
        total_wins: profile.total_wins || 0
      })
      .eq('id', profile.id);
      
    if (error) {
    } else {
      profile.total_bets = profile.total_bets || 0;
      profile.total_wins = profile.total_wins || 0;
    }
  }
}

  async function fetchUserProfile(userId) {
  try {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
          
    if (error) throw error;
    profile = profileData;
    
    await initializeProfileStats();
    
  } catch (error) {
  }
}
  
  onMount(async () => {    
    if (data.user) {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (error) throw error;
        profile = profileData;
        
      } catch (error) {
      }
    }
  });
    
  function startRideTheBus() {    
  // Kontrollera inloggning och saldo
  if (!isLoggedIn) {
    gameMessage = "Please log in to place bets.";
    return;
  }
  if (profile && profile.credits < betAmount) {
    gameMessage = "Not enough credits for this bet!";
    return;
  }

  // Startar spelet
  rideTheBusActive = true;
  rideTheBusStage = 'color'; // Första gissningen: färg
  gameMessage = "Guess the card color (red or black)";
  busCards = []; // användna kort
  gameHistory = [];
  potentialWinnings = betAmount * 2;
}

function dealNewCard() {
  // Skapar ett nytt slumpmässigt kort
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  const color = (suit === "♥️" || suit === "♦️") ? "red" : "black";
  const numValue = values.indexOf(value) + 1;

  previousCard = busCards.length > 0 ? busCards[busCards.length - 1] : null;

  // Lägger till kortet i spelet
  busCards = [...busCards, { suit, value, color, numValue }];
  return busCards[busCards.length - 1];
}

function makeGuess(guess) {
  // Avbryt om spelet inte är aktivt
  if (!rideTheBusActive) return;

  currentGuess = guess;
  let correct = false;
  const currentCard = dealNewCard(); // Dra ett nytt kort

  // 1 Gissa kulör
  if (rideTheBusStage === 'color') {
    correct = guess === currentCard.color;
    rideTheBusStage = correct ? 'highlow' : endGame(false); // Nästa steg eller avsluta
    potentialWinnings = correct ? betAmount * 4 : 0;
    gameMessage = correct 
      ? "Correct! Now guess if the next card is higher or lower" 
      : gameMessage;

  // 2 Gissa högre eller lägre än förra kortet
  } else if (rideTheBusStage === 'highlow') {
    const prev = busCards[busCards.length - 2].numValue;
    correct = guess === 'higher' 
      ? currentCard.numValue > prev 
      : currentCard.numValue < prev;

    // Om lika, gissningen är fel
    if (currentCard.numValue === prev) correct = false;

    rideTheBusStage = correct ? 'inout' : endGame(false);
    potentialWinnings = correct ? betAmount * 8 : 0;
    gameMessage = correct 
      ? "Correct! Now guess if the next card is inside or outside the range" 
      : gameMessage;

  // 3 Gissa om nästa kort är mellan (inside) eller utanför (outside) de två tidigare
  } else if (rideTheBusStage === 'inout') {
    const [a, b] = [busCards[busCards.length - 3].numValue, busCards[busCards.length - 2].numValue];
    const [min, max] = [Math.min(a, b), Math.max(a, b)];

    correct = guess === 'inside' 
      ? currentCard.numValue > min && currentCard.numValue < max 
      : currentCard.numValue < min || currentCard.numValue > max;

    // Om kortet har samma värde som gränserna, är det fel
    if (currentCard.numValue === min || currentCard.numValue === max) correct = false;

    rideTheBusStage = correct ? 'suit' : endGame(false);
    potentialWinnings = correct ? betAmount * 20 : 0;
    gameMessage = correct 
      ? "Correct! Final round: guess the suit" 
      : gameMessage;

  // 4 Gissa exakt vilken färg det blir
  } else if (rideTheBusStage === 'suit') {
    correct = guess === currentCard.suit;
    endGame(correct); // Spelet avslutas oavsett utfall
  }

  // Spara varje gissning i historik
  gameHistory = [...gameHistory, {
    stage: rideTheBusStage.charAt(0).toUpperCase() + rideTheBusStage.slice(1),
    guess,
    card: `${currentCard.value}${currentCard.suit}`,
    correct
  }];
}

async function endGame(won) {
  // Uppdaterar meddelande, krediter och historik
  gameMessage = won
    ? `Congratulations! You won ${potentialWinnings} credits!`
    : "Sorry, you lost! Try again?";
  await updateCredits(won ? potentialWinnings : -betAmount);
  await recordBet('ride_the_bus', betAmount, won ? potentialWinnings : 0, won ? 'won' : 'lost');

  // Avsluta spel
  rideTheBusActive = false;
  rideTheBusStage = 'result';
}
  
async function flipCoin() {
  // Kontrollera om användaren är inloggad
  if (!isLoggedIn) {
    gameMessage = "Please log in to place bets.";
    return;
  }

  // Kontrollera om användaren har tillräckligt med pengar
  if (isLoggedIn && profile && profile.credits < coinBetAmount) {
    gameMessage = "Not enough credits for this bet!";
    return;
  }

  coinFlipping = true; // Indikera att slantsingling pågår

  let flips = 0;
  const maxFlips = 10 + Math.floor(Math.random() * 5); // Slumpa antal animationer för rolig animation

  // Starta en timer för att animera slantsingling
  const flipInterval = setInterval(() => {
    coinSide = Math.random() > 0.5 ? 'heads' : 'tails'; // Slumpa sida
    flips++;

    // Avsluta animationen efter tillräckligt många "flippar"
    if (flips >= maxFlips) {
      clearInterval(flipInterval); // Stoppa intervallet

      // Vänta lite innan resultat visas
      setTimeout(async () => {
        coinFlipping = false;

        const won = coinSide === coinBetChoice; // Jämför spelarens val med resultatet

        if (won) {
          const winnings = coinBetAmount * 2;
          gameMessage = `You guessed ${coinBetChoice}. It's ${coinSide}. You won ${winnings} credits!`;

          // Uppdatera spelarens krediter och spara spelresultat
          if (isLoggedIn && profile) {
            await updateCredits(coinBetAmount);
            await recordBet('coin_flip', coinBetAmount, winnings, 'won');
          }
        } else {
          gameMessage = `You guessed ${coinBetChoice}. It's ${coinSide}. You lost ${coinBetAmount} credits.`;

          // Dra bort krediter och spara spelresultat
          if (isLoggedIn && profile) {
            await updateCredits(-coinBetAmount);
            await recordBet('coin_flip', coinBetAmount, 0, 'lost');
          }
        }
      }, 500); // Fördröjning innan resultat visas för att vänta på animation
    }
  }, 100); // Snabb animation, 100ms per flip
}

  
async function rollDice() {
  if (!isLoggedIn) {
    gameMessage = "Please log in to place bets.";
    return;
  }
  
  if (isLoggedIn && profile && profile.credits < diceBetAmount) {
    gameMessage = "Not enough credits for this bet!";
    return;
  }
  
  diceRolling = true;
  
  let rolls = 0;
  const maxRolls = 10 + Math.floor(Math.random() * 5);
  const rollInterval = setInterval(() => {
    diceValue = Math.floor(Math.random() * 6) + 1;
    rolls++;
    
    if (rolls >= maxRolls) {
      clearInterval(rollInterval);
      setTimeout(async () => {
        diceRolling = false;
        
        let won = false;
        let winnings = 0;
        
        if (diceBetType === 'highlow') {
          if (diceBetChoice === 'high') { // Vale high
            won = diceValue > 3; // Vann om dicevalue är 3 eller högre
            winnings = won ? diceBetAmount * 2 : 0;
          } else { // Valde lågt
            won = diceValue <= 3; // Van om dicevalue är 3 eller mindre
            winnings = won ? diceBetAmount * 2 : 0;
          }
        } else {  // Specefikt nummer
          won = diceValue === parseInt(diceSpecificNumber);
          winnings = won ? diceBetAmount * 6 : 0; // 6 gånger pengarna
        }
        
        if (won) {
          gameMessage = `You rolled a ${diceValue}. You won ${winnings} credits!`;
          if (isLoggedIn && profile) { 
            await updateCredits(diceBetAmount); 
            await recordBet('dice_roll', diceBetAmount, winnings, 'won');
          }
        } else {
          gameMessage = `You rolled a ${diceValue}. You lost ${diceBetAmount} credits.`;
          if (isLoggedIn && profile) {
            await updateCredits(-diceBetAmount);
            await recordBet('dice_roll', diceBetAmount, 0, 'lost');
          }
        }
      }, 500);
    }
  }, 100);
}

// Uppdaterar saldot    
async function updateCredits(amount) {
  if (!isLoggedIn || !profile) {
    return false;
  }
  
  try {
    const newBalance = profile.credits + amount; // Sätter en nytt saldo
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ credits: newBalance })
      .eq('id', profile.id)
      .select();
      
    if (error) throw error;
        
    profile.credits = newBalance; // Ändrar saldot i databasen till min new balance
    return true;
    
  } catch (error) {
    return false;
  }
}
  
async function recordBet(gameType, amount, winnings, status) {
  if (!isLoggedIn || !profile) {
    return false;
  }
  
  try {
    const betRecord = {
      user_id: profile.id,
      game_type: gameType,
      amount: amount,
      winnings: status === 'won' ? winnings : 0,
      status: status
    };
    
    if (gameType !== 'ride_the_bus' && gameType !== 'coin_flip' && gameType !== 'dice_roll') {
      betRecord.match_id = null;
    }
        
    try {
      const currentTotalBets = profile.total_bets || 0;
      const currentTotalWins = profile.total_wins || 0;
      
      const newTotalBets = currentTotalBets + 1;
      const newTotalWins = status === 'won' ? currentTotalWins + 1 : currentTotalWins;
      
      const { data: updatedProfile, error: statsError } = await supabase
        .from('profiles')
        .update({
          total_bets: newTotalBets,
          total_wins: newTotalWins
        })
        .eq('id', profile.id)
        .select();
        
      if (statsError) {
        return true; 
      }
      
      
      profile.total_bets = newTotalBets;
      profile.total_wins = newTotalWins;
      
      return true;
    } catch (statsError) {
      return true; 
    }
    
  } catch (error) {
    return false;
  }
}
  
  function placeBet(matchId, betType) {
    if (!isLoggedIn) {
      gameMessage = "Please log in to place a bet on matches.";
      return;
    }
    
    if (profile) {
      const match = matches.find(m => m.id === matchId);
      if (!match) {
        gameMessage = "Match not found.";
        return;
      }

      let odds = 0;
      if (betType === 'home') {
        odds = match.home_odds;
      } else if (betType === 'draw') {
        odds = match.draw_odds;
      } else if (betType === 'away') {
        odds = match.away_odds;
      }

      const betAmountForMatch = 100;

      if (profile.credits < betAmountForMatch) {
        gameMessage = "You don't have enough credits for this bet.";
        return;
      }

      const potentialWin = Math.round(betAmountForMatch * odds);

      try {
        const { error } = supabase
          .from('bets')
          .insert({
            user_id: profile.id,
            match_id: matchId,
            bet_on: betType,
            amount: betAmountForMatch,
            potential_win: potentialWin,
            status: 'pending',
            created_at: new Date().toISOString()
          });

        if (error) throw error;

        updateCredits(-betAmountForMatch);

        gameMessage = `Bet placed successfully! Potential win: ${potentialWin} credits.`;

        const { data: updatedBets } = supabase
          .from('bets')
          .select('*, matches(*)')
          .eq('user_id', profile.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (updatedBets) {
          pendingBets = updatedBets;
        }
      } catch (error) {
      }
    }
  }
</script>

<div class="bet-page">
  <div class="profile-bar">
    {#if isLoggedIn && profile}
      <div class="user-info-container">
        <div class="user-avatar">
          {profile.username[0].toUpperCase()}
        </div>
        <div class="user-details">
          <div class="user-main-info">
            <span class="username">{profile.username}</span>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-icon">💰</span>
                <span class="credits">{profile.credits.toLocaleString()}</span>
              </div>
              {#if profile.total_bets > 0}
                <div class="stat-item">
                  <span class="stat-icon">🎯</span>
                  <span class="win-rate">
                    {((profile.total_wins / profile.total_bets) * 100).toFixed(1)}% Win Rate
                  </span>
                </div>
              {/if}
            </div>
          </div>
          <div class="actions">
            {#if profile.credits < 100}
              <div class="low-credits-warning">
                <span class="warning-icon">⚠️</span> Low on credits!
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <div class="game-tabs">
    <button 
      class="tab-button {activeGame === 'ridethebus' ? 'active' : ''}"
      on:click={() => setActiveGame('ridethebus')}>
      Ride the Bus
    </button>
    <button 
      class="tab-button {activeGame === 'coinflip' ? 'active' : ''}"
      on:click={() => setActiveGame('coinflip')}>
      Coin Flip
    </button>
    <button 
      class="tab-button {activeGame === 'diceroll' ? 'active' : ''}"
      on:click={() => setActiveGame('diceroll')}>
      Dice Roll
    </button>
    <button 
      class="tab-button rules-button"
      on:click={toggleRules}>
      {showRules ? 'Hide Rules' : 'Show Rules'}
    </button>
  </div>
  
  {#if showRules}
    <div class="rules-panel">
      {#if activeGame === 'ridethebus'}
        <h3>Ride the Bus Rules</h3>
        <ul>
          <li><strong>Round 1:</strong> Guess the color of the card (Red or Black)</li>
          <li><strong>Round 2:</strong> Guess if the next card is higher or lower than the previous card</li>
          <li><strong>Round 3:</strong> Guess if the next card is inside or outside the range of the previous two cards</li>
          <li><strong>Round 4:</strong> Guess the suit of the next card (♠️, ♥️, ♦️, ♣️)</li>
          <li>Win all rounds to 20x your stake</li>
        </ul>
      {:else if activeGame === 'coinflip'}
        <h3>Coin Flip Rules</h3>
        <ul>
          <li>Choose either Heads or Tails</li>
          <li>Set your bet amount</li>
          <li>If you guess correctly, you 2x your bet</li>
          <li>If you guess wrong, you lose your bet</li>
        </ul>
      {:else if activeGame === 'diceroll'}
        <h3>Dice Roll Rules</h3>
        <ul>
          <li><strong>High/Low:</strong> Bet on whether the roll will be high (4-6) or low (1-3), high/Low pays 2x if you win</li>
          <li><strong>Exact Number:</strong> Bet on a specific number from 1 to 6, exact Number pays 6x if you win</li>
        </ul>
      {/if}
    </div>
  {/if}

  <div class="game-content">    
    {#if activeGame === 'ridethebus'}
      <div class="ridethebus-section">
        <h2>Ride the Bus</h2>
        
        {#if !rideTheBusActive && rideTheBusStage === 'start'}
          <div class="game-setup">            
            <div class="bet-setup">
              <label for="busbet">Your bet amount:</label>
              <input 
                type="number" 
                id="busbet" 
                bind:value={betAmount} 
                min="10" 
                max={profile?.credits || 1000}
              />
              
              <button 
              class="start-button" 
              on:click={startRideTheBus}
            >
              Start Game
            </button>
            </div>
          </div>
        {:else if rideTheBusActive || rideTheBusStage === 'result'}
          <div class="game-board">
            <div class="game-status">
              <div class="stage-indicator">
                <div class="stage {rideTheBusStage === 'color' || rideTheBusStage === 'result' && gameHistory.length >= 1 ? 'active' : ''}">Color</div>
                <div class="stage {rideTheBusStage === 'highlow' || rideTheBusStage === 'result' && gameHistory.length >= 2 ? 'active' : ''}">High/Low</div>
                <div class="stage {rideTheBusStage === 'inout' || rideTheBusStage === 'result' && gameHistory.length >= 3 ? 'active' : ''}">In/Out</div>
                <div class="stage {rideTheBusStage === 'suit' || rideTheBusStage === 'result' && gameHistory.length >= 4 ? 'active' : ''}">Suit</div>
              </div>
              
              <div class="bet-info">
                <span>Bet: {betAmount} credits</span>
                {#if potentialWinnings > 0}
                  <span>Potential win: {potentialWinnings} credits</span>
                {/if}
              </div>
            </div>
            
            <div class="cards-display">
              {#each busCards as card, i}
                <div class="card {card.color}">
                  <span class="card-value">{card.value}</span>
                  <span class="card-suit">{card.suit}</span>
                </div>
              {/each}
            </div>
            
            <div class="game-message">
              {gameMessage}
            </div>
            
            {#if rideTheBusActive}
              <div class="guess-controls">
                {#if rideTheBusStage === 'color'}
                  <button class="guess-button red" on:click={() => makeGuess('red')}>Red</button>
                  <button class="guess-button black" on:click={() => makeGuess('black')}>Black</button>
                {:else if rideTheBusStage === 'highlow'}
                  <button class="guess-button" on:click={() => makeGuess('higher')}>Higher</button>
                  <button class="guess-button" on:click={() => makeGuess('lower')}>Lower</button>
                {:else if rideTheBusStage === 'inout'}
                  <button class="guess-button" on:click={() => makeGuess('inside')}>Inside</button>
                  <button class="guess-button" on:click={() => makeGuess('outside')}>Outside</button>
                {:else if rideTheBusStage === 'suit'}
                  <button class="guess-button suit-button" on:click={() => makeGuess('♠️')}>♠️</button>
                  <button class="guess-button suit-button red" on:click={() => makeGuess('♥️')}>♥️</button>
                  <button class="guess-button suit-button red" on:click={() => makeGuess('♦️')}>♦️</button>
                  <button class="guess-button suit-button" on:click={() => makeGuess('♣️')}>♣️</button>
                {/if}
              </div>
            {:else}
              <button class="start-button" on:click={resetGames}>Play Again</button>
            {/if}
            
            {#if gameHistory.length > 0}
              <div class="game-history">
                <h3>Game History</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Your Guess</th>
                      <th>Card</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each gameHistory as round}
                      <tr>
                        <td>{round.stage}</td>
                        <td>{round.guess}</td>
                        <td>{round.card}</td>
                        <td class={round.correct ? 'correct' : 'incorrect'}>
                          {round.correct ? '✓' : '✗'}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        {/if}
      </div>
      
    {:else if activeGame === 'coinflip'}
      <div class="coinflip-section">
        <h2>Coin Flip</h2>
        
        <div class="game-board">
            <div class="coin-display {coinFlipping ? 'flipping' : ''}">
                {#if coinSide === 'heads'}
                  <div class="coin heads">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="48" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
                      <circle cx="50" cy="40" r="14" fill="#d97706"/>
                      <path d="M30,72 C30,58 70,58 70,72 L30,72 Z" fill="#d97706"/>
                      <path d="M25,47 C25,30 75,30 75,47" fill="none" stroke="#d97706" stroke-width="3"/>
                      <text x="50" y="90" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#7c2d12">HEADS</text>
                    </svg>
                  </div>
                {:else if coinSide === 'tails'}
                  <div class="coin tails">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="48" fill="#6366f1" stroke="#4f46e5" stroke-width="2"/>
                      <circle cx="50" cy="50" r="30" fill="none" stroke="#4f46e5" stroke-width="3"/>
                      <circle cx="50" cy="50" r="20" fill="none" stroke="#4f46e5" stroke-width="2"/>
                      <circle cx="50" cy="50" r="10" fill="#4f46e5"/>
                      <text x="50" y="90" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#312e81">TAILS</text>
                    </svg>
                  </div>
                {:else}
                  <div class="coin question">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="48" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
                      <text x="50" y="65" font-family="sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="#64748b">?</text>
                      <text x="50" y="90" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#475569">FLIP</text>
                    </svg>
                  </div>
                {/if}
              </div>
          
          <div class="game-message">
            {gameMessage}
          </div>
          
          <div class="bet-controls">
            <div class="bet-amount">
              <label for="coinbet">Bet Amount:</label>
              <input 
                type="number" 
                id="coinbet" 
                bind:value={coinBetAmount} 
                min="10" 
                max={profile?.credits || 1000}
                disabled={coinFlipping}
              />
            </div>
            
            <div class="bet-choice">
              <button 
                class="choice-button {coinBetChoice === 'heads' ? 'selected' : ''}" 
                on:click={() => coinBetChoice = 'heads'}
                disabled={coinFlipping}>
                Heads
              </button>
              <button 
                class="choice-button {coinBetChoice === 'tails' ? 'selected' : ''}" 
                on:click={() => coinBetChoice = 'tails'}
                disabled={coinFlipping}
              >
                Tails
              </button>
            </div>
            
            <button 
              class="flip-button" 
              on:click={flipCoin} 
              disabled={coinFlipping}
            >
              {coinFlipping ? 'Flipping...' : 'Flip Coin'}
            </button>
          </div>
        </div>
      </div>
      
    {:else if activeGame === 'diceroll'}
      <div class="diceroll-section">
        <h2>Dice Roll</h2>
        
        <div class="game-board">
          <div class="dice-display {diceRolling ? 'rolling' : ''}">
            <div class="dice">
              {#if diceValue === 1}
                <div class="dot center"></div>
              {:else if diceValue === 2}
                <div class="dot top-left"></div>
                <div class="dot bottom-right"></div>
              {:else if diceValue === 3}
                <div class="dot top-left"></div>
                <div class="dot center"></div>
                <div class="dot bottom-right"></div>
              {:else if diceValue === 4}
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
              {:else if diceValue === 5}
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot center"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
              {:else if diceValue === 6}
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot middle-left"></div>
                <div class="dot middle-right"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
              {/if}
            </div>
          </div>
          
          <div class="game-message">
            {gameMessage}
          </div>
          
          <div class="bet-controls">
            <div class="bet-amount">
              <label for="dicebet">Bet Amount:</label>
              <input 
                type="number" 
                id="dicebet" 
                bind:value={diceBetAmount} 
                min="10" 
                max={profile?.credits || 1000}
                disabled={diceRolling}
              />
            </div>
            
            <div class="bet-type-choice">
              <button 
                class="type-button {diceBetType === 'highlow' ? 'selected' : ''}" 
                on:click={() => diceBetType = 'highlow'}
                disabled={diceRolling}
              >
                High/Low
              </button>
              <button 
                class="type-button {diceBetType === 'exact' ? 'selected' : ''}" 
                on:click={() => diceBetType = 'exact'}
                disabled={diceRolling}
              >
                Exact Number
              </button>
            </div>
            
            {#if diceBetType === 'highlow'}
              <div class="bet-choice">
                <button 
                  class="choice-button {diceBetChoice === 'high' ? 'selected' : ''}" 
                  on:click={() => diceBetChoice = 'high'}
                  disabled={diceRolling}
                >
                  High (4-6)
                </button>
                <button 
                  class="choice-button {diceBetChoice === 'low' ? 'selected' : ''}" 
                  on:click={() => diceBetChoice = 'low'}
                  disabled={diceRolling}
                >
                  Low (1-3)
                </button>
              </div>
            {:else}
              <div class="number-choice">
                <label for="exact-number">Choose a number:</label>
                <select 
                  id="exact-number" 
                  bind:value={diceSpecificNumber} 
                  disabled={diceRolling}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>
            {/if}
            
            <button 
              class="roll-button" 
              on:click={rollDice} 
              disabled={diceRolling}
            >
              {diceRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .bet-page {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .profile-bar {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
  }
  
  .user-info-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-avatar {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  .user-details {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .user-main-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .username {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .user-stats {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  
  .stat-icon {
    font-size: 0.875rem;
  }
  
  .credits {
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-weight: 500;
    font-size: 0.875rem;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }
  
  .win-rate {
    color: #0f766e;
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
  
  .profile-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  
  .profile-link:hover {
    color: #2563eb;
    text-decoration: underline;
  }
  
  .low-credits-warning {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #b91c1c;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    background: #fee2e2;
    border-radius: 0.375rem;
  }
  
  .login-button, .signup-button {
    padding: 0.375rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  
  .login-button {
    color: #3b82f6;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
  }
  
  .signup-button {
    color: white;
    background: #3b82f6;
  }
  
  .login-button:hover {
    background: #dbeafe;
  }
  
  .signup-button:hover {
    background: #2563eb;
  }
  
  @media (max-width: 640px) {
    .user-details {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .actions {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    
    .login-button, .signup-button {
      width: 100%;
      text-align: center;
    }
  }
  
  .profile-bar {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .username {
    font-weight: 600;
    color: #1e293b;
  }
  
  .credits {
    background-color: #3b82f6;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-weight: 500;
  }
  
  .login-prompt {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
  }
  
  .login-button, .signup-button {
    color: #3b82f6;
    font-weight: 500;
    text-decoration: none;
  }
  
  .login-button:hover, .signup-button:hover {
    text-decoration: underline;
  }
  
  .login-hint {
    margin-top: 1rem;
    text-align: center;
    color: #64748b;
    font-size: 0.9rem;
  }
  
  
  .game-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .tab-button {
    padding: 0.75rem 1.25rem;
    background-color: #f1f5f9;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .tab-button:hover {
    background-color: #e2e8f0;
  }
  
  .tab-button.active {
    background-color: #3b82f6;
    color: white;
  }
  
  .rules-button {
    margin-left: auto;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
  }
  
  .rules-panel {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .rules-panel h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1e293b;
  }
  
  .rules-panel ul {
    margin-left: 1.5rem;
    color: #4b5563;
  }
  
  .rules-panel li {
    margin-bottom: 0.5rem;
  }
  
  .game-content {
    background-color: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .game-content h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .match-list {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .match-card {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .match-header {
    background-color: #f8fafc;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .league-name {
    font-weight: 500;
    color: #64748b;
  }
  
  .match-teams {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    padding: 1.5rem;
    gap: 1rem;
    align-items: center;
  }
  
  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .team-name {
    font-weight: 500;
    color: #1e293b;
    text-align: center;
  }
  
  .bet-button {
    background-color: #f1f5f9;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .bet-button:hover {
    background-color: #3b82f6;
    color: white;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #64748b;
  }
  
  .pending-bets {
    margin-top: 2rem;
  }
  
  .bets-list {
    display: grid;
    gap: 1rem;
  }
  
  .bet-item {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f8fafc;
  }
  
  .bet-match {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .teams {
    font-weight: 500;
    color: #1e293b;
  }
  
  .match-time {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .bet-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: right;
  }
  
  .game-setup {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  
  .game-description {
    color: #4b5563;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .bet-setup {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .bet-setup label {
    font-weight: 500;
    color: #374151;
  }
  
  .bet-setup input {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  
  .start-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 1rem;
  }
  
  .start-button:hover:not(:disabled) {
    background-color: #2563eb;
    transform: translateY(-1px);
  }
  
  .start-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .game-board {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .game-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .coin-display {
    text-align: center;
    margin: 2rem 0;
  }
  
  .coin {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    overflow: hidden; 
  }
  
  .flipping .coin {
    animation: flip 0.5s linear infinite;
  }
  
  @keyframes flip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(360deg); }
  }
  
  .coin.heads, .coin.tails, .coin.question {
    position: relative;
  }
  
  .coin.heads::after, .coin.tails::after, .coin.question::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }
  
  .stage-indicator {
    display: flex;
    gap: 0.5rem;
  }
  
  .stage {
    padding: 0.5rem 1rem;
    background-color: #f1f5f9;
    color: #64748b;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .stage.active {
    background-color: #3b82f6;
    color: white;
  }
  
  .bet-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: #4b5563;
    font-size: 0.875rem;
    text-align: right;
  }
  
  .cards-display {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  
  .card {
    width: 5rem;
    height: 7rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: relative;
  }
  
  .card.red {
    color: #ef4444;
  }
  
  .card.black {
    color: #1e293b;
  }
  
  .card-value {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .card-suit {
    font-size: 1.5rem;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
  }
  
  .game-message {
    text-align: center;
    margin: 1.5rem 0;
    font-weight: 500;
    color: #1e293b;
    min-height: 1.5rem;
  }
  
  .guess-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .guess-button {
    padding: 0.75rem 1.5rem;
    background-color: #f1f5f9;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 6rem;
  }
  
  .guess-button:hover {
    background-color: #e2e8f0;
    transform: translateY(-1px);
  }
  
  .guess-button.red {
    color: #ef4444;
  }
  
  .guess-button.black {
    color: #1e293b;
  }
  
  .suit-button {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
  }
  
  .game-history {
    margin-top: 2rem;
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5rem;
  }
  
  .game-history h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1e293b;
    text-align: center;
  }
  
  .game-history table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .game-history th, .game-history td {
    padding: 0.75rem;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .game-history th {
    font-weight: 500;
    color: #64748b;
    font-size: 0.875rem;
  }
  
  .correct {
    color: #10b981;
    font-weight: 600;
  }
  
  .incorrect {
    color: #ef4444;
    font-weight: 600;
  }
  
  .coin-display {
    text-align: center;
    margin: 2rem 0;
  }
  
  .coin {
    width: 7rem;
    height: 7rem;
    background: linear-gradient(45deg, #f59e0b, #d97706);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    transition: transform 0.3s;
  }
  
  .coin.heads {
    background: linear-gradient(45deg, #f59e0b, #d97706);
  }
  
  .coin.tails {
    background: linear-gradient(45deg, #6366f1, #4f46e5);
  }
  
  .flipping .coin {
    animation: flip 0.5s linear infinite;
  }
  
  @keyframes flip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(360deg); }
  }
  
  .bet-controls {
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .bet-amount {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bet-amount label {
    font-weight: 500;
    color: #374151;
  }
  
  .bet-amount input {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  
  .bet-choice {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .choice-button {
    flex: 1;
    padding: 0.75rem;
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .choice-button.selected {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .flip-button, .roll-button {
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .flip-button:hover:not(:disabled), .roll-button:hover:not(:disabled) {
    background-color: #2563eb;
    transform: translateY(-1px);
  }
  
  .flip-button:disabled, .roll-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .dice-display {
    text-align: center;
    margin: 2rem 0;
  }
  
  .dice {
    width: 6rem;
    height: 6rem;
    background-color: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    position: relative;
    margin: 0 auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .rolling .dice {
    animation: roll 0.3s linear infinite;
  }
  
  @keyframes roll {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .dot {
    position: absolute;
    width: 1rem;
    height: 1rem;
    background-color: #1e293b;
    border-radius: 50%;
  }
  
  .dot.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .dot.top-left {
    top: 20%;
    left: 20%;
  }
  
  .dot.top-right {
    top: 20%;
    right: 20%;
  }
  
  .dot.middle-left {
    top: 50%;
    left: 20%;
    transform: translateY(-50%);
  }
  
  .dot.middle-right {
    top: 50%;
    right: 20%;
    transform: translateY(-50%);
  }
  
  .dot.bottom-left {
    bottom: 20%;
    left: 20%;
  }
  
  .dot.bottom-right {
    bottom: 20%;
    right: 20%;
  }
  
  .bet-type-choice {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .type-button {
    flex: 1;
    padding: 0.75rem;
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .type-button.selected {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .number-choice {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .number-choice label {
    font-weight: 500;
    color: #374151;
  }
  
  .number-choice select {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 1rem;
    background-color: white;
  }

  .games-info-box {
  max-width: 1000px;
  margin: 2rem auto;
  background: #f8fafc;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #3b82f6;
  color: white;
  padding: 1rem 1.5rem;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.game-info-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s;
}

.game-info-card:hover {
  transform: translateY(-5px);
}

.game-icon {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.payout-info {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  padding: 0.75rem;
  border-radius: 0 0.5rem 0.5rem 0;
  font-style: italic;
  color: #1e40af;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .game-info-card {
    padding: 1.25rem;
  }
}

.hidden {
  display: none;
}
  
  @media (max-width: 768px) {
    .bet-page {
      padding: 0.5rem;
    }
    
    .game-content {
      padding: 1.5rem 1rem;
    }
    
    .game-tabs {
      gap: 0.25rem;
    }
    
    .tab-button {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    }
    
    .match-teams {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .bet-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .bet-details {
      text-align: left;
    }
    
    .guess-controls {
      gap: 0.5rem;
    }
    
    .guess-button {
      padding: 0.5rem 1rem;
      min-width: 5rem;
    }
    
    .game-status {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .bet-info {
      text-align: left;
      width: 100%;
    }
    
    .card {
      width: 4rem;
      height: 5.5rem;
    }
    
    .coin {
      width: 5rem;
      height: 5rem;
      font-size: 2rem;
    }
    
    .dice {
      width: 5rem;
      height: 5rem;
    }
    
    .dot {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
</style>