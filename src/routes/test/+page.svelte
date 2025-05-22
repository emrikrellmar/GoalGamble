<script>
import {onMount} from 'svelte'


    onMount(async () => {
      const { data: creditsData } = await supabase
        .from('profiles')
        .select('username')
    });
</script>

{#each winLeaders as user}
  <p>{user.username}</p>
{/each}

