<script>
  import { user } from "../stores/UserStore";
  import { globalState } from "../stores/GlobalStore";
  import App from './App.svelte'
  import NewApp from "./NewApp.svelte";

  export let supabase

  let apps = []

  async function getApps () {
    const { data, error } = await supabase.rpc('get_user_apps', { user_uuid: $user.session.user.id })
    if (error) console.error(error)
    apps = data
  }

  getApps()
</script>

<section id="app-grid">
  {#each apps as app}
    <App bind:app={app} refreshApps={getApps} /> 
  {/each}
  {#if $globalState.editMode}
    <NewApp refreshApps={getApps} />
  {/if}
</section>

<style lang="scss">
  #app-grid {
    display: flex;
    gap: 40px;
  }
</style>
