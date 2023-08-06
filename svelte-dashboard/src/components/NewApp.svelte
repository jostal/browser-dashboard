<script>
  import { user } from "../stores/UserStore"
  import { globalState } from "../stores/GlobalStore";

  export let refreshApps = () => {}

  let showCreate = false
  let iconFile
  let appConfig = {
    name: '',
    url: ''
  }

  let handleSaveApp = async () => {
    let iconPath = null

    if (iconFile) {
      let curDate = Date.now()
      iconPath = `${curDate}-${iconFile.name}`

      // upload icon
      const uploadRes = await $globalState.supabase.storage.from('app-icons').upload(iconPath, iconFile)
    }

    const updateRes = await $globalState.supabase.rpc('save_app', {
      user_uuid: $user.session.user.id,
      app_id: null,
      app_name: appConfig.name,
      app_url: appConfig.url,
      icon: iconPath
    })

    refreshApps()
    showCreate = false
    appConfig.name = ''
    appConfig.url = ''
    iconFile = null
    iconPath = null
  }

  $: console.log(showCreate)

</script>

<div id="newApp" class="app-wrapper">
  <div class="new-app-wrapper" on:click={() => showCreate = true}>
    <i class="material-symbols-outlined">add_circle</i>
    <label>New App</label> 
  </div>

  {#if showCreate}
    <div class="popup-bg" on:click={() => showCreate = false}>
      <div id="edit-app-popup" on:click|stopPropagation>
        <h1>Add New App</h1>

        <i class="material-symbols-outlined close" on:click={() => showCreate = false}>close</i>

        <label for="app-name">Name</label>
        <input type="text" name="app-name" value={appConfig.name} on:change={(e) => appConfig.name = e.target.value} />

        <label for="app-url">URL</label>
        <input type="url" name="app-url" value={appConfig.url} on:change={(e) => appConfig.url = e.target.value} />

        <div class="icon-preview">
          <label for="icon">Icon</label>
          {#if iconFile} 
            <img src={URL.createObjectURL(iconFile)} alt="Icon Preview" />       
          {/if}
          <input name="icon" type="file" accept="image/*" on:input={(e) => iconFile = e.target.files[0]} />
        </div>

        <button type="button" on:click={handleSaveApp}>Save</button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .app-wrapper {
    display: inline-block;

    .new-app-wrapper {
      cursor: pointer;
      padding: 1em;

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 1em;
      }

      i {
        font-size: 64px;
        color: white;
        text-shadow: 0px 0px 6px rgba(0, 0, 0, 1);
      }

      label {
        color: white;
        text-shadow: 0px 0px 6px rgba(0, 0, 0, 1);
        display: block;
        text-align: center;
        margin-top: 7px;
        cursor: pointer;
      }
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

      #edit-app-popup {
        background: var(--bg-color);
        border-radius: 0.5em;
        padding: 10px;
        position: relative;

        .close {
          position: absolute;
          right: 0.2em;
          top: 0.2em;
          cursor: pointer;
        }


        img {
          width: 64px;
          height: 64px;
        }

        label {
          display: block;
          text-align: left;
          margin-top: 10px;
          margin-bottom: 5px;

          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
</style>
