<svelte:head>
  <title>Home - GoalGamble</title>
</svelte:head>

<script>
  import { authStore } from '$lib/stores/auth';
  import Leaderboard from '$lib/components/Leaderboard.svelte';
</script>

<div class="home-container">
  <div class="hero-section">
    {#if !$authStore.user}
    <h1>Predict. Bet. Win.</h1>
    {:else}
    <h1>Welcome to GoalGamble!</h1>
    {/if}
    
    {#if !$authStore.user}
    <p class="hero-subtitle">
      Experience the thrill of betting without the risk! GoalGamble lets you create your own account, place bets on matches or games, and earn virtual credits to climb the leaderboard!
    </p>
    {:else}
    <p class="hero-subtitle">
      View different betting games and win credits, climb the leaderboard and surpass your friends!
    </p>
    {/if}

    {#if !$authStore.user}
      <div class="cta-buttons">
        <a href="/signup" class="btn primary">Make your account</a>
        <a href="/login" class="btn secondary">Login</a>
      </div>
    {:else}
      <div class="cta-buttons">
        <a href="/bet" class="btn primary">Bet on different games</a>
      </div>
    {/if}
  </div>

  <div class="features-section">
    <div class="feature-card">
      <div class="feature-icon">🎯</div>
      <h3>Risk-Free Betting</h3>
      <p>Use virtual credits to practice your betting strategy without real money</p>
    </div>
    
    <div class="feature-card">
      <div class="feature-icon">💰</div>
      <h3>Entertaining Games</h3>
      <p>Play several entertaining games and win credits</p>
    </div>  
    
    <div class="feature-card">
      <div class="feature-icon">📈</div>
      <h3>Track Progress</h3>
      <p>Monitor your performance and climb the leaderboard</p>
    </div>
  </div>

  <div class="leaderboard-section">
    <div class="leaderboard-container">
      <h2 class="section-title">Leaderboard.</h2>
      <div class="leaderboard-wrapper">
        <Leaderboard limit={5} sortBy="credits" />
      </div>
    </div>
  </div>
  
  <div class="free-service-section">
    <div class="free-service-container">
      <h2 class="section-title">Completely Free.</h2>
      <div class="free-content">
        <p>GoalGamble is and always will be 100% free. We don't ask for your payment information or hidden fees.</p>
        
        <div class="free-features">
          <div class="free-feature">
            <div class="check-circle">✓</div>
            <span>No subscription fees</span>
          </div>
          <div class="free-feature">
            <div class="check-circle">✓</div>
            <span>No payment information needed</span>
          </div>
          <div class="free-feature">
            <div class="check-circle">✓</div>
            <span>Start with 1000 virtual credits</span>
          </div>
          <div class="free-feature">
            <div class="check-circle">✓</div>
            <span>Full access to all betting features</span>
          </div>
        </div>
        
        {#if !$authStore.user}
          <a href="/signup" class="free-cta">Create Your Free Account</a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 6rem;
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.05) 25%, transparent 100%);
  border-radius: 2rem;
}

h1 {
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(45deg, #3b82f6, #2563eb, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(37, 99, 235, 0.1);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.125rem;
}

.primary {
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}

.secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
}

.secondary:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  padding: 0 2rem;
  width: 100%;
  margin-top: -1rem; 
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  padding: 1rem;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
  border-radius: 1rem;
}

.feature-card h3 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
  font-size: 1.125rem;
}

.leaderboard-section {
  padding: 0 2rem;
}

.leaderboard-container {
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
  text-align: center;
}

.leaderboard-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.free-service-section {
  padding: 0 2rem;
}

.free-service-container {
  background: white;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.free-content {
  max-width: 700px;
  margin: 0 auto;
}

.free-service-container p {
  color: #475569;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.free-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.free-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.check-circle {
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.free-feature span {
  color: #334155;
  font-size: 1rem;
}

.free-cta {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}

.free-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
}

@media (max-width: 768px) {
  .home-container {
    gap: 4rem;
  }

  .hero-section {
    padding: 3rem 1rem;
  }

  h1 {
    font-size: 2.75rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }

  .features-section {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .feature-card {
    padding: 2rem;
  }
  
  .leaderboard-container {
    padding: 2rem 1rem;
  }
  
  .free-service-container {
    padding: 2.5rem 1.5rem;
  }
  
  .free-features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .free-service-container p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2.25rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
    padding: 0 2rem;
  }

  .feature-icon {
    font-size: 3rem;
  }
  
  .free-service-container {
    padding: 2rem 1rem;
  }
  
  .free-cta {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }
}
</style>