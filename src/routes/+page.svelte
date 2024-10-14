<script>
    import MatchList from '$lib/components/MatchList.svelte';
    export let data;
  </script>
  
  <svelte:head>
    <title>GoalGamble - Home</title>
  </svelte:head>
  
  <h1>Welcome to GoalGamble </h1>
  <MatchList matches={data.matches} />