<svelte:head>
  <title>Sign Up - GoalGamble</title>
</svelte:head>

<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';

  let username = ''; // Sätter tomma variabler
  let email = '';
  let password = '';
  let loading = false;
  let error = null;

  async function handleSignup() {
    try {
      loading = true;
      error = null;
      
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username  // Sparar användarnamn i metadata
          },
          emailRedirectTo: undefined 
        }
      });

      if (signupError) throw signupError;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          email,
          credits: 1000,  // Startbelopp för bets
          total_bets: 0,
          total_wins: 0
        });
      
      await supabase.auth.signOut();  // Loggar ut så användaren kan logga in igen
      
      goto('/login?from=signup');  // Navigerar till inloggningssidan
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="page-container">
  <div class="signup-container">
    <div class="signup-box">
      <h1>Create Account</h1>
      
      <form on:submit|preventDefault={handleSignup}>  <!-- Förhindrar omladdning av sidan -->
        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}

        <div class="form-fields"> <!-- Textruta för användarnamnet -->
          <div class="form-group"> 
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              bind:value={username} 
              required 
              placeholder="yourname"
              disabled={loading}
              autocomplete="username"
            />
          </div>
          
          <div class="form-group">  <!-- Textruta för mail adressen -->
            <label for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              bind:value={email} 
              required 
              placeholder="you@example.com"
              disabled={loading}
              autocomplete="email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              bind:value={password} 
              required 
              placeholder="••••••••"
              disabled={loading}
              autocomplete="new-password"
              minlength="6"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            class:loading={loading} 
          >
            {loading ? 'Creating account...' : 'Sign Up'} <!-- Visar olika text beroende på loading-status, svelte funktion, när loading = true -->
          </button>
        </div>
      </form>
      
      <div class="login-link">
        Already have an account?
        <a href="/login">Log in</a>
      </div>

      <div class="terms-agreement">
        By creating an account you accept our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a> <!-- Länk till terms och privacy -->
      </div>
    </div>
  </div>
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 250px); 
    justify-content: center;
  }

  .signup-container {
    max-width: 28rem;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
  }

  .signup-box {
    background: white;
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    color: #1e293b;
  }

  .error-message {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: #dc2626;
    font-size: 0.875rem;
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.15s ease;
    background-color: #fff;
  }

  input:hover {
    border-color: #d1d5db;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  button {
    padding: 0.875rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  button:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  button.loading {
    position: relative;
    cursor: wait;
  }

  .login-link {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .login-link a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.25rem;
  }

  .login-link a:hover {
    text-decoration: underline;
  }

  .terms-agreement {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.7rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .terms-agreement a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .terms-agreement a:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .signup-container {
      padding: 1rem;
    }

    .signup-box {
      padding: 1.5rem;
    }

    h1 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    button {
      padding: 0.75rem 1rem;
    }
  }
</style>