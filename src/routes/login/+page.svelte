<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  
  let email = '';
  let password = '';
  let loading = false;
  let error = null;
  
  $: fromSignup = $page.url.searchParams.get('from') === 'signup';
  
  async function handleLogin() {
    try {
      loading = true;
      error = null;
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (loginError) throw loginError;
      
      goto('/');
      
    } catch (e) {
      console.error('Login error:', e);
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - GoalGamble</title>
</svelte:head>

<div class="page-container">
  <div class="login-container">
    <div class="login-box">
      <h1>Log In</h1>
      
      {#if fromSignup}
        <div class="success-message">
          Account created successfully! Please log in.
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleLogin}>
        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}

        <div class="form-fields">
          <div class="form-group">
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
              autocomplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            class:loading={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
      
      <div class="signup-link">
        Don't have an account?
        <a href="/signup">Sign up</a>
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

  .login-container {
    max-width: 28rem;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
  }

  .login-box {
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

  .success-message {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #dcfce7;
    border: 1px solid #86efac;
    border-radius: 0.75rem;
    color: #16a34a;
    font-size: 0.875rem;
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

  .signup-link {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .signup-link a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.25rem;
  }

  .signup-link a:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .login-container {
      padding: 1rem;
    }

    .login-box {
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