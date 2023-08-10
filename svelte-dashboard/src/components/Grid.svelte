<script>
  import { user } from "../stores/UserStore";
  import { globalState } from "../stores/GlobalStore";
  import App from "./App.svelte";
  import NewApp from "./NewApp.svelte";
  import Search from "./Search.svelte";
  import Time from "./Time.svelte";

  export let supabase;

  let apps = [];
  let dragging = false;
  let dragTarget;
  let dragSrc;

  async function getApps() {
    const { data, error } = await supabase.rpc("get_user_apps", {
      user_uuid: $user.session.user.id,
    });
    if (error) console.error(error);
    apps = data;

    // sort apps
    apps.sort((a, b) => {
      return a.app_order - b.app_order;
    });

    apps = apps;
  }

  getApps();

  // drag handlers
  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.getAttribute("key"));
    dragSrc = e.target.getAttribute("id");
    dragging = true;
  }

  function handleDragOver(e) {
    dragTarget = e.currentTarget.getAttribute("key");
    return false;
  }

  function handleDragEnd() {
    dragTarget = null;
    dragging = false;
  }

  async function handleDrop(e) {
    dragTarget = null;
    let newLocation = e.currentTarget.getAttribute("key");
    let oldLocation = e.dataTransfer.getData("text/plain");

    // update order in db
    const updateRes = await supabase.rpc("update_app_order", {
      user_uuid: $user.session.user.id,
      app_id: dragSrc,
      new_location: newLocation,
    });

    getApps();
  }
</script>

<section id="app-grid">
  {#if $user.config?.clock.show_clock}
    <div class="time-widget">
      <Time is24Hour={$user.config.clock.use_24h_clock} />
    </div>
  {/if}
  <div class="search-widget">
    <Search />
  </div>
  {#each apps as app (app.app_order)}
    <div
      class={app.app_order === parseInt(dragTarget)
        ? "target app-container"
        : "app-container"}
      key={app.app_order}
      id={app.id}
      draggable={$globalState.editMode ? "true" : "false"}
      on:dragstart={handleDragStart}
      on:dragover|preventDefault={handleDragOver}
      on:dragenter|preventDefault
      on:dragend={handleDragEnd}
      on:drop={handleDrop}
    >
      <App bind:app refreshApps={getApps} />
    </div>
  {/each}
  {#if $globalState.editMode}
    <NewApp refreshApps={getApps} />
  {/if}
</section>

<style lang="scss">
  #app-grid {
    flex-basis: 100%;
    display: flex;
    row-gap: 40px;
    column-gap: 30px;
    flex-wrap: wrap;
    max-width: 1000px;
    justify-content: center;

    .search-widget {
      width: 100%;
      flex-basis: 100%;
    }

    .target {
      opacity: 0.6;
    }
  }
</style>
