<script>
  import { user } from "../stores/UserStore";
  import App from './App.svelte'

  export let supabase

  let apps = []

  let getApps = async () => {
    const { data, error } = await supabase.rpc('get_user_apps', { user_uuid: $user.session.user.id })
    if (error) console.error(error)
    apps = data
  }

  getApps()
</script>

<section id="app-grid">
  {#each apps as app}
    <App app={app} /> 
  {/each}
</section>

<style lang="scss">
  #app-grid {
    display: flex;
    gap: 40px;
  }
</style>
