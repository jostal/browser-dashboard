<script>
  import { onMount } from "svelte";
  import { globalState } from "../stores/GlobalStore";
  import { user } from "../stores/UserStore";

  let engines = [];

  onMount(async () => {
    const enginesRes = await $globalState.configSupabase.rpc(
      "get_search_engines"
    );
    engines = enginesRes.data;
  });

  let handleSetEngine = async (e) => {
    const updateRes = await $globalState.configSupabase.rpc(
      "change_search_engine",
      {
        user_uuid: $user.session.user.id,
        engine_name: e.target.value,
      }
    );

    $user.refresh = true;
  };
</script>

<div class="settings">
  <h1>Search Settings</h1>
  <hr />
  <label for="searchEngine">Preferred Search Engine</label>
  <select name="searchEngine">
    {#each engines as engine}
      <option
        on:click={handleSetEngine}
        selected={engine.id === $user.config.searchEngine.id ? "selected" : ""}
        value={engine.name}>{engine.name}</option
      >
    {/each}
  </select>
</div>

<style lang="scss">
  .settings {
    label {
      margin-top: 1em;
      display: block;
    }

    select {
      width: 100%;
      margin-top: 10px;
      padding: 0.5em;
    }
  }
</style>
