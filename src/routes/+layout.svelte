<script>
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import BetSlip from '$lib/components/BetSlip.svelte';
  </script>
  
  <div class="app">
    <Header />
    <main>
      <div class="content">
        <slot />
      </div>
      <aside>
        <BetSlip />
      </aside>
    </main>
    <Footer />
  </div>
  
  <style>
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  
    main {
      flex: 1;
      display: flex;
      padding: 1rem;
    }
  
    .content {
      flex: 3;
      margin-right: 1rem;
    }
  
    aside {
      flex: 1;
    }
  </style>