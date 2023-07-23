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

</script>

<div id="newApp" class="app-wrapper" on:click={() => showCreate = true}>
  <button>+</button>

  {#if showCreate}
    <div class="popup-bg">
      <div id="edit-app-popup">
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
