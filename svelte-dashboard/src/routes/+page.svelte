<script>
  import { user } from '../stores/UserStore.js' 
  import Auth from '../components/Auth.svelte'
  import Settings from '../components/Settings.svelte'

  export let data
  let { supabase } = data
  $: ({ supabase } = data)

  $user.session = data.session
</script>

<main>
  <div id="top-bar">
    <Settings supabase={supabase} />
  </div>
  {#if !$user.session}
    <div class="popup-bg">
      <Auth supabase={supabase} />
    </div>
  {/if}
</main>

<style lang="scss">
  main {
    #top-bar {
      width: 100%;
      height: 50px;
      display: grid;
      align-items: center;
    }

    .popup-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: var(--popup-bg);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
