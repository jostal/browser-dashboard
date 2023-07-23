<script>
  import { user } from "../stores/UserStore";
  import { globalState } from "../stores/GlobalStore.js"
  import Appearance from "./Appearance.svelte";
  
  export let supabase
  export let configSupabase

  let handleSignOut = async () => {
    await supabase.auth.signOut()
    $user.session = null
    showSettings = false
  }

  let showSettings = false
  let currentSettings = 'Appearance'
</script>

<div class="settings-container">
  <button id="edit-toggle" on:click={() => $globalState.editMode = !$globalState.editMode}>
    <img src={$globalState.editMode ? 'edit-off.svg' : 'edit.svg'} alt="Edit icon" />
  </button>
  <button id="settings-toggle" on:click={() => showSettings = !showSettings}>
    <img src="settings.svg" alt="Settings icon" />
  </button>
  {#if showSettings}
    <div class="popup-bg" on:click={() => showSettings = false}>
      <div id="settings-popup" on:click|stopPropagation>
        <section id="settings-nav">
          <ul>
            <li class={currentSettings === 'Appearance' ? 'active' : ''} on:click={() => currentSettings = 'Appearance'}>Appearance</li>
            <li class="signout" on:click|stopPropagation={handleSignOut}>Sign Out <img src="logout.svg" alt="Sign out" /></li>
          </ul>
        </section>
        <section id="settings-view">
          {#if currentSettings === 'Appearance'}
            <Appearance supabase={supabase} configSupabase={configSupabase} />  
          {/if}
        </section>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .settings-container {
    justify-self: flex-end;

    #settings-toggle, #edit-toggle {
      background: none;
      padding: 5px;
      border: none;
      width: 40px;
      height: 40px;
      cursor: pointer;

      img {
        width: 100%;
      }
    }

    .popup-bg {
      position: absolute;
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
            border-right: 1px solid black;

            li {
              width: calc(100% - 18px);
              padding: 8px;
              border-bottom: 1px solid black;
              border-left: 1px solid black;
              border-right: 1px solid black;
              cursor: pointer;
              text-align: center;

              &.active {
                background: #cccccc;
              }
              
              &:first-child {
                border-top: 1px solid black;
                border-radius: 0.5em 0 0 0;
              }
            }

            .signout {
              border-top: 1px solid black;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0 0 0 0.5em;
              margin-top: auto;
              
              img {
                margin-left: 8px;
              }
            }
          }
        }

        #settings-view {
          padding: 10px;
          width: 80%;
        }
      }
    }
  }
</style>
