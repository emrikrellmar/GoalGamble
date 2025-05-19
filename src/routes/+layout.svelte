<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { authStore } from '$lib/stores/auth';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let isLoading = true;

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    
    authStore.set({
      user: data.session?.user || null,
      loading: false
    });
    
    isLoading = false;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      authStore.set({
        user: session?.user || null,
        loading: false
      });
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  });
</script>

<div class="app-wrapper">
  <div class="app-content">
    <header>
      <Header />
    </header> 

    <main>
      {#if isLoading}
        <div class="loading">Loading...</div>
      {:else}
        <slot />
      {/if}
    </main>
  </div>

  <Footer />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-content {
    flex: 1;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
</style>