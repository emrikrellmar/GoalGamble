<script>
    import MatchList from '$lib/components/MatchList.svelte';
    export let data;
  </script>
  
  <svelte:head>
    <title>GoalGamble - Home</title>
  </svelte:head>
  
  <MatchList matches={data.matches} />