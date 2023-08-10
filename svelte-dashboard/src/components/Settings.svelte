<script>
  import { user } from "../stores/UserStore";
  import { globalState } from "../stores/GlobalStore.js";
  import Appearance from "./Appearance.svelte";
  import SearchSettings from "./SearchSettings.svelte";
  import WidgetSettings from "./WidgetSettings.svelte";

  export let supabase;
  export let configSupabase;

  let handleSignOut = async () => {
    await supabase.auth.signOut();
    $user.session = null;
    showSettings = false;
  };

  let toggleDarkMode = async () => {
    await configSupabase.rpc("toggle_dark_mode", {
      user_uuid: $user.session.user.id,
      is_dark: !$user.config.dark_mode,
    });

    $user.refresh = true;
  };

  let showSettings = false;
  let currentSettings = "Appearance";
</script>

<div class="settings-container">
  <button id="dark-toggle" on:click={toggleDarkMode}>
    {#if $user.config?.dark_mode}
      <i title="Enable light mode" class="material-symbols-outlined"
        >light_mode</i
      >
    {:else}
      <i title="Enable dark mode" class="material-symbols-outlined">dark_mode</i
      >
    {/if}
  </button>
  <button
    id="edit-toggle"
    on:click={() => ($globalState.editMode = !$globalState.editMode)}
  >
    <i class="material-symbols-outlined" title="Toggle edit mode"
      >{$globalState.editMode ? "edit_off" : "edit"}</i
    >
  </button>
  <button id="settings-toggle" on:click={() => (showSettings = !showSettings)}>
    <i class="material-symbols-outlined" title="Open settings">settings</i>
  </button>
  {#if showSettings}
    <div class="popup-bg" on:click={() => (showSettings = false)}>
      <div id="settings-popup" on:click|stopPropagation>
        <i
          class="material-symbols-outlined close"
          on:click={() => (showSettings = false)}>close</i
        >
        <section id="settings-nav">
          <ul>
            <li
              class={currentSettings === "Appearance" ? "active" : ""}
              on:click={() => (currentSettings = "Appearance")}
            >
              Appearance
            </li>
            <li
              class={currentSettings === "Search" ? "active" : ""}
              on:click={() => (currentSettings = "Search")}
            >
              Search
            </li>
            <li
              class={currentSettings === "Widgets" ? "active" : ""}
              on:click={() => (currentSettings = "Widgets")}
            >
              Widgets
            </li>
            <li class="signout" on:click|stopPropagation={handleSignOut}>
              Sign Out <i class="material-symbols-outlined">logout</i>
            </li>
          </ul>
        </section>
        <section id="settings-view">
          {#if currentSettings === "Appearance"}
            <Appearance {supabase} {configSupabase} />
          {:else if currentSettings === "Search"}
            <SearchSettings />
          {:else if currentSettings === "Widgets"}
            <WidgetSettings />
          {/if}
        </section>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .settings-container {
    justify-self: flex-end;

    #settings-toggle,
    #edit-toggle,
    #dark-toggle {
      background: none;
      padding: 5px;
      border: none;
      width: 40px;
      height: 40px;
      cursor: pointer;
      color: inherit;

      i {
        font-size: 32px;
        text-shadow: var(--text-shadow);
      }
    }

    .popup-bg {
      position: absolute;
      z-index: 10;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--popup-bg);

      #settings-popup {
        background: var(--bg-color);
        border-radius: 0.5em;
        width: 90%;
        height: 70%;
        display: flex;
        position: relative;

        .close {
          position: absolute;
          right: 0.2em;
          top: 0.2em;
          cursor: pointer;
        }

        #settings-nav {
          width: 20%;
          height: 100%;

          ul {
            display: flex;
            flex-direction: column;
            height: 100%;
            margin: 0;
            padding: 0;
            list-style-type: none;
            border-right: 1px solid var(--bg-border);

            li {
              font-weight: bold;
              width: calc(100% - 17px);
              padding: 8px;
              border-bottom: 1px solid var(--bg-border);
              border-left: 1px solid var(--bg-border);
              cursor: pointer;
              text-align: center;

              &.active {
                background: var(--selected);
              }

              &:first-child {
                border-top: 1px solid var(--bg-border);
                border-radius: 0.5em 0 0 0;
              }
            }

            .signout {
              border-top: 1px solid var(--bg-border);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0 0 0 0.5em;
              margin-top: auto;
              background: #f03a30;
              color: white;

              i {
                margin-left: 5px;
              }
            }
          }
        }

        #settings-view {
          border: 1px solid var(--bg-border);
          border-left: none;
          border-radius: 0 0.5em 0.5em 0;
          width: 80%;
          display: flex;
          justify-content: center;
          padding: 10px;
        }
      }
    }
  }
</style>
