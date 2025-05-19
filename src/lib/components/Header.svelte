<script>
import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { authStore } from '$lib/stores/auth';

  let username = '';
  
  $: if ($authStore.user) {
    if ($authStore.user.user_metadata?.username) {
      username = $authStore.user.user_metadata.username;
    } else {
      fetchUsername($authStore.user.id);
    }
  }
  
  async function fetchUsername(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
      
    if (data?.username) {
      username = data.username;
    }
  }

  let mobileMenuOpen = false;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  function handleClickOutside(event) {
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuOpen && 
        menuButton && !menuButton.contains(event.target) && 
        mobileMenu && !mobileMenu.contains(event.target)) {
      mobileMenuOpen = false;
    }
  }

  function handleResize() {
    if (window.innerWidth > 768 && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }

  onMount(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<svelte:window on:click={handleClickOutside}/>

<nav class="navbar">
  <div class="nav-content">
    <a href="/" class="logo">GoalGamble<span class="logo-dot">.</span></a>

    <button class="menu-button" on:click|stopPropagation={toggleMobileMenu} aria-label="Toggle menu">
      {#if mobileMenuOpen}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-svg">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line> <!-- animation till mobil meny -->
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-svg">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      {/if}
    </button>

    <div class="desktop-nav">
      {#if $authStore.user}
        <a href="/bet" class="nav-link">Bet</a>
        <a href="/leaderboards" class="nav-link">Leaderboards</a>
        <a href="/educational" class="nav-link">Educational</a>
        <a href="/about" class="nav-link">About</a>
        <a href="/profile" class="nav-link">{username || 'Profile'}</a>
        <button class="logout-button" on:click={handleLogout}>Logout</button>
      {:else}
        <a href="/about" class="nav-link">About</a>
        <a href="/educational" class="nav-link">Educational</a>
        <a href="/login" class="nav-link signup-button">Login</a>
        <a href="/signup" class="nav-link signup-button">Sign Up</a>
        
      {/if}
    </div>

    <div class="mobile-menu" class:mobile-menu-open={mobileMenuOpen} 
         transition:fade={{ duration: 200 }}>
      {#if $authStore.user}
        <a href="/bet" class="mobile-link">Bet</a>
        <a href="/educational" class="mobile-link">Educational</a>
        <a href="/about" class="mobile-link">About</a>
        <a href="/profile" class="nav-link">{username || 'Profile'}</a>
        <button class="mobile-logout-button" on:click={handleLogout}>Logout</button>
      {:else}
        <a href="/login" class="mobile-link">Login</a>
        <a href="/signup" class="mobile-link signup-mobile">Sign Up</a>
        <a href="/educational" class="mobile-link">Educational</a>
        <a href="/about" class="mobile-link">About</a>
      {/if}
    </div>
  </div>
</nav>

<style>
  .navbar {
    background: white;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .logo {
    font-weight: 800;
    color: #3b82f6;
    text-decoration: none;
    font-size: 2.5rem;
    transition: color 0.2s ease;
    z-index: 60;
  }

  .logo:hover {
    color: #2563eb;
  }

  .logo-dot {
    color: #2563eb;
  }

  .desktop-nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .nav-link {
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.5rem;
    transition: color 0.2s ease;
    padding: 0.5rem;
    border-radius: 0.375rem;
  }

  .nav-link:hover {
    color: #3b82f6;
  }

  .logout-button {
    padding: 0.5rem 1rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 1.5rem;
    transition: all 0.2s ease;
  }

  .logout-button:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }

  .signup-button {
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }

  .signup-button:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .menu-button {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 60;
  }

  .menu-svg {
    color: #3b82f6;
    transition: transform 0.3s ease;
  }

  .mobile-menu {
    display: none; 
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 40;
    flex-direction: column;
    gap: 0.5rem;
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .mobile-link {
    display: block;
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.25rem;
    padding: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    transition: all 0.2s ease;
  }

  .mobile-link:hover {
    color: #3b82f6;
    background: #f9fafb;
  }

  .mobile-logout-button {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 1.25rem;
    text-align: center;
    width: 100%;
  }

  .signup-mobile {
    background: #3b82f6;
    color: white !important;
    border-radius: 0.375rem;
    text-align: center;
    border-bottom: none;
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }

    .menu-button {
      display: block;
    }

    .mobile-menu-open {
      display: flex !important;
    }

    .logo {
      font-size: 1.75rem;
    }
    
    .mobile-menu {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .logo {
      font-size: 1.5rem;
    }

    .navbar {
      padding: 0.75rem;
    }
  }
</style>