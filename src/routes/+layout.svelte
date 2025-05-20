<script>
  import { onMount } from 'svelte'; // Importerar
  import { supabase } from '$lib/supabase';  
  import { authStore } from '$lib/stores/auth';  
  import Header from '$lib/components/Header.svelte';  
  import Footer from '$lib/components/Footer.svelte';  

  // Spårar om komponenten fortfarande laddar
  let isLoading = true;
  
  onMount(async () => {
    // Hämtar befintlig session vid sidladdning
    const { data } = await supabase.auth.getSession();
    
    // Uppdaterar auth store med användardata eller null om ej inloggad
    authStore.set({
      user: data.session?.user || null,
      loading: false
    });
    
    // Markerar komponenten som färdigladdad
    isLoading = false;
    
    // Prenumererar på auth-förändringar (inloggning/utloggning)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      authStore.set({
        user: session?.user || null,
        loading: false
      });
    });
    
    // Städar upp prenumerationen när komponenten förstörs
    return () => {
      subscription?.unsubscribe();
    };
  });
</script>

<div class="app-wrapper">
  <div class="app-content">
    <header>
      <Header /> <!-- Importerar header komponent -->
    </header> 

    <main>
      {#if isLoading}
        <div class="loading">Loading </div> <!-- Laddning ifall isLoading = true, om inte supabase kan connecta -->
      {:else}
        <slot />
      {/if}
    </main>
  </div>

  <Footer /> <!-- Importerar Footer komponent -->
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