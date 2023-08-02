<script>
  import { onMount } from 'svelte';
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
  import { createClient } from '@supabase/supabase-js';
  import { user, getConfig } from '../stores/UserStore.js' 
  import { globalState } from '../stores/GlobalStore.js';
  import Auth from '../components/Auth.svelte'
  import Settings from '../components/Settings.svelte'
  import Grid from '../components/Grid.svelte';

  export let data
  let { supabase } = data
  $: ({ supabase } = data)

  $globalState.supabase = supabase

  const configSupabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    db: { schema: 'config' }
  })

  $globalState.configSupabase = configSupabase

  $user.session = data.session

  let loadConfig = async () => {
    $user.config = await getConfig($user.session.user.id)
  }

  // change user background
  let loadBackground = async () => {
    const res = supabase.storage.from('backgrounds').getPublicUrl($user.config.background.background_filepath)
    let root = document.querySelector(':root')
    $: root.style.background = `url(${res.data.publicUrl})` 
  }

  onMount(async () => {
    await loadConfig()
    loadBackground()
  })

  $: $user, refreshConfig()

  let refreshConfig = async () => {
    if ($user.refresh) {
      await loadConfig()
      loadBackground()
      $user.refresh = false
    }
  }
</script>

<main>
  <div id="top-bar">
    <Settings supabase={supabase} configSupabase={configSupabase} />
  </div>

  {#if !$user.session}
    <div class="popup-bg">
      <Auth supabase={supabase} />
    </div>
  {/if}

  <div id="grid-container">
    <Grid supabase={supabase} />
  </div>
</main>

<style lang="scss">
  main {

    #grid-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }

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
