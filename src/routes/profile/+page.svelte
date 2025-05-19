<svelte:head>
  <title>Profile - GoalGamble</title>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  // Håller användarens profildata, kontrollerar laddningstillstånd, lagrar eventuella felmeddelanden, styr visning av redigeringsformulär för profil,
  // håller det nya användarnamnet vid redigering och indikerar om sparande pågår
  let profile = null;
  let loading = true;
  let error = null;
  let showEditProfile = false;
  let editUsername = '';
  let isSaving = false;

onMount(async () => {
  try {
    // Hämtar inloggad användare från Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    // Kontrollerar om användaren är autentiserad
    if (!user) throw new Error("Not authenticated");
    
    // Försöker hämta användarens profil från profiles-tabellen
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Om profilen inte hittas, skapa en ny
    if (profileError && profileError.code === 'PGRST116') {
      console.log("Profile not found, creating one...");
      
      const defaultUsername = user.user_metadata?.username || 
      `User${user.id.substring(0, 6)}`;
                             
      // Skapar en ny profilpost i databasen
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: defaultUsername,
          email: user.email,
          credits: 1000, // Startar med 1000 krediter
          total_bets: 0,
          total_wins: 0
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      profileData = newProfile;
      
      // Uppdaterar användarens metadata med användarnamnet
      await supabase.auth.updateUser({
        data: { username: defaultUsername }
      });
    } else if (profileError) {
      throw profileError;
    }
    
    // Lagrar profildata och initialiserar redigeringsvariabel
    profile = profileData;
    editUsername = profile.username;

  } catch (e) {
    console.error("Profile error:", e);
    error = e.message;
  } finally {
    loading = false;
  }
});

// Funktion för att spara ändringar i användarprofilen
async function saveProfile() {
  if (!editUsername.trim() || editUsername === profile.username) {
    showEditProfile = false;
    return;
  }

  // Sätter sparandetillstånd
  isSaving = true;
  try {
    // Uppdaterar användarnamn i profiles-tabellen
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: editUsername })
      .eq('id', profile.id);

    if (updateError) throw updateError;
    
    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: { username: editUsername }
    });
    
    if (authUpdateError) throw authUpdateError;
    
    profile.username = editUsername;
    showEditProfile = false;
  } catch (e) {
    console.error("Profile update error:", e);
    error = e.message;
  } finally {
    isSaving = false;
  }
}
</script>

<div class="profile-container">
  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading profile...</p>
    </div>
  {:else if error}
    <div class="error-message">
      <span class="icon">⚠️</span>
      <p>{error}</p>
    </div>
  {:else}
    <div class="profile-header">
      <div class="profile-info">
        <!-- Enkel avatar för användaren som visar första bokstaven i användarnamnet -->
        <div class="avatar">
          {profile.username[0].toUpperCase()}
        </div>
        <div class="user-details">
          {#if showEditProfile}
            <!-- Redigerings ruta för användarnamn -->
            <div class="edit-profile">
              <input 
                type="text" 
                bind:value={editUsername}
                placeholder="Enter new username"
              />
              <div class="edit-actions">
                <button 
                  on:click={saveProfile} 
                  disabled={isSaving}
                  class="save-btn"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  on:click={() => { 
                    showEditProfile = false;
                    editUsername = profile.username;
                  }}
                  class="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          {:else}
            <!-- Visning av användarnamn med redigeringsknapp -->
            <h1>
              {profile.username}
              <button 
                class="edit-btn"
                on:click={() => showEditProfile = true}
              >
                (✏️)
              </button>
            </h1>
          {/if}
          <!-- Visar medlemskapstid och e-post -->
          <p class="member-since">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
          <p class="email">{profile.email}</p>
        </div>
      </div>

      <!-- Statistiksektion med användarens data -->
      <div class="stats-overview">
        <!-- Visar användarens kreditsaldo -->
        <div class="stat-card primary">
          <span class="stat-icon">💰</span>
          <div class="stat-content">
            <span class="stat-value">{profile.credits}</span>
            <span class="stat-label">Credits</span>
          </div>
        </div>
        
        <!-- Visar totalt antal vad användaren har lagt -->
        <div class="stat-card">
          <span class="stat-icon">🎲</span>
          <div class="stat-content">
            <span class="stat-value">{profile.total_bets || 0}</span>
            <span class="stat-label">Total Bets</span>
          </div>
        </div>
        
        <!-- Visar vinstprocent med beräkning -->
        <div class="stat-card">
          <span class="stat-icon">📈</span>
          <div class="stat-content">
            <span class="stat-value">
              {profile.total_bets > 0 
                ? ((profile.total_wins / profile.total_bets) * 100).toFixed(1) 
                : 0}%
            </span>
            <span class="stat-label">Win Rate</span>
          </div>
        </div>
      </div>
    </div>

 {/if}
</div>

<!-- Prestationssektion som visar användarens uppnådda bedrifter -->
<div class="achievements-section">
  <h2 class="section-title">Betting Achievements</h2>
  
  <div class="achievements-grid">
    {#if !loading && profile}
      <!-- Lista med prestationer som användaren kan låsa upp -->
      {#each [
        // Grundläggande prestation för att skapa konto
        {
          id: 'first_steps',
          title: 'First Steps',
          description: 'Sign up and create your account',
          icon: '👣',
          requirement: 1,
          current: 1,
          unlocked: true,
          type: 'account'
        },
        // Prestation för att samla 5000 krediter
        {
          id: 'stacking_up',
          title: 'Stacking Up',
          description: 'Accumulate over 5,000 credits',
          icon: '💸',
          requirement: 5000,
          current: profile.credits || 0,
          unlocked: (profile.credits || 0) >= 5000,
          type: 'performance'
        },
        // Prestation för att samla 10000 krediter
        {
          id: 'high_roller',
          title: 'High Roller',
          description: 'Accumulate 10,000 credits',
          icon: '💰',
          requirement: 10000,
          current: profile.credits || 0,
          unlocked: (profile.credits || 0) >= 10000,
          type: 'wealth'
        },
        // Prestation för första vadet
        {
          id: 'first_bet',
          title: 'First Bet',
          description: 'Place your first bet',
          icon: '🎲',
          requirement: 1,
          current: profile.total_bets || 0,
          unlocked: (profile.total_bets || 0) >= 1,
          type: 'betting'
        },
        // Prestation för att vinna 25 vad
        {
          id: 'prediction_expert',
          title: 'Prediction Expert',
          description: 'Win 25 bets in total',
          icon: '🔮',
          requirement: 25,
          current: profile.total_wins || 0,
          unlocked: (profile.total_wins || 0) >= 25,
          type: 'betting'
        },
        // Prestation för att lägga 100 vad
        {
          id: 'bet_master',
          title: 'Master Better',
          description: 'Place 100 bets',
          icon: '🎯',
          requirement: 100,
          current: profile.total_bets || 0,
          unlocked: (profile.total_bets || 0) >= 100,
          type: 'betting'
        }
      ] as achievement}
        <!-- Kort som visar varje prestation med framsteg -->
        <div class="achievement-card" class:unlocked={achievement.unlocked}>
          <div class="achievement-icon">
            <span class="icon">{achievement.icon}</span>
            {#if achievement.unlocked}
              <span class="completed-badge">✓</span>
            {/if}
          </div>
          
          <div class="achievement-info">
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            
            <!-- Framstegsindikator som visar hur nära användaren är att uppnå prestationen -->
            <div class="progress-bar">
              <div 
                class="progress" 
                style="width: {Math.min((achievement.current / achievement.requirement) * 100, 100)}%"
              ></div>
            </div>
            
            <p class="progress-text">
              {achievement.current} / {achievement.requirement}
              {#if achievement.unlocked}
                <span class="completed-text">Completed!</span>
              {/if}
            </p>
          </div>
        </div>
      {/each}
    {:else}
      <div class="loading-state">
        <div class="spinner small"></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .loading-state {
    text-align: center;
    padding: 4rem;
  }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  .spinner.small {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .profile-header {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .profile-info {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, #3b82f6, #2563eb);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
    font-weight: bold;
  }

  .user-details h1 {
    font-size: 2rem;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .member-since, .email {
    color: #64748b;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .edit-btn:hover {
    opacity: 1;
  }

  .edit-profile {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .edit-profile input {
    padding: 0.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1.25rem;
  }

  .edit-actions {
    display: flex;
    gap: 0.5rem;
  }

  .save-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }

  .save-btn {
    background: #3b82f6;
    color: white;
  }

  .cancel-btn {
    background: #e5e7eb;
    color: #374151;
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    background: #f8fafc;
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
  }

  .stat-card.primary {
    color: black;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  .section-title {
    font-size: 1.5rem;
    color: #1e293b;
    margin-bottom: 1.5rem;
  }

  .achievements-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-top: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    margin: 0 auto 2rem;
    padding: 2rem 1rem;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .achievement-card {
    background: #f8fafc;
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    gap: 1.5rem;
    position: relative;
    transition: all 0.3s ease;
  }

  .achievement-card.unlocked {
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    border: 1px solid #bae6fd;
  }

  .achievement-icon {
    position: relative;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .icon {
    font-size: 1.5rem;
  }

  .completed-badge {
    position: absolute;
    bottom: -0.5rem;
    right: -0.5rem;
    background: #22c55e;
    color: white;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    border: 2px solid white;
  }

  .achievement-info {
    flex: 1;
  }

  .achievement-info h3 {
    font-size: 1.125rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .achievement-info p {
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .progress-bar {
    height: 0.5rem;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    border-radius: 9999px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.75rem;
    color: #64748b;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .completed-text {
    color: #22c55e;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .profile-info {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .stats-overview {
      grid-template-columns: 1fr;
    }

    .achievements-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .profile-container {
      padding: 1rem;
    }

    .profile-header, .achievements-section {
      padding: 1.5rem;
    }

    .achievement-card {
      padding: 1rem;
    }
  }
</style>