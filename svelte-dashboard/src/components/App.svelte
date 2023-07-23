<script>
  import { onMount } from "svelte";
  import { globalState } from "../stores/GlobalStore";
  import { user } from "../stores/UserStore";

  export let app
  export let refreshApps = () => {}

  let showEdit
  let newIconPreview
  let newIconFile
  let appConfig = {
    id: app.id,
    name: app.name,
    url: app.url,
    icon: null
  }

  $: app, assignIcon()

  async function assignIcon () {
    appConfig.icon = await getIconUrl(app.icon_path) 
  }

  onMount(async () => {
    appConfig.icon = await getIconUrl(app.icon_path)
  })

  async function getIconUrl (icon_path) {
    // check if file exists
    let existsRes

    if (icon_path) {
      existsRes = await $globalState.supabase.storage.from('app-icons').list('', {
        search: icon_path
      })
    }

    let icon = `https://www.google.com/s2/favicons?sz=128&domain=${app.url}`
    
    if (existsRes?.data.length > 0 && icon_path) {
      let { data } = await $globalState.supabase.storage.from('app-icons').getPublicUrl(icon_path)
      icon = data.publicUrl
    }
    
    return icon
  }

  let uploadIcon = (e) => {
    newIconPreview = URL.createObjectURL(e.target.files[0])
    newIconFile = e.target.files[0]
  }

  let updateApp = async () => {
    let curDate = Date.now()
    let iconPath
    if (newIconFile) {
      const uploadRes = await $globalState.supabase.storage.from('app-icons').upload(`${curDate}-${newIconFile.name}`, newIconFile)
      iconPath = `${curDate}-${newIconFile.name}`
    }

    const updateRes = await $globalState.supabase.rpc('save_app', {
      user_uuid: $user.session.user.id,
      app_id: appConfig.id,
      app_name: appConfig.name,
      app_url: appConfig.url,
      icon: iconPath ? iconPath : app.icon_path
    })

    refreshApps()
    showEdit = false
  }

  let deleteApp = async () => {
    const deleteRes = await $globalState.supabase.rpc('delete_app', {
      app_id: appConfig.id
    })

    refreshApps()
    showEdit = false
  }

</script>

<div class="app-wrapper" draggable="false">
  {#if $globalState.editMode}
    <div class="edit-app" on:click={() => showEdit = true} draggable="false">
      <img src={appConfig.icon} alt={`${app.name} icon`} draggable="false"/>
      <label>{app.name}</label>
    </div>
  {:else}
    <a href={app.url}>
      <img src={appConfig.icon} alt={`${app.name} icon`} />
      <label>{app.name}</label>
    </a>
  {/if}

  {#if showEdit}
    <div class="popup-bg">
      <div id="edit-app-popup">
        <div class="icon-preview">
          <label>Icon</label>
          <img src={newIconPreview ? newIconPreview : appConfig.icon} alt={`${app.name} icon`} />
          <label>Upload Icon</label>
          <input type="file" accept="image/*" hint="New Icon" on:input={(e) => uploadIcon(e)} />
        </div>
        <label for="app-url">URL</label>
        <input type="url" name="app-url" value={appConfig.url} on:change={(e) => appConfig.url = e.target.value} />
        <label for="app-name">Name</label>
        <input type="text" name="app-name" value={appConfig.name} on:change={(e) => appConfig.name = e.target.value} />
        <button type="button" on:click={updateApp}>Save</button>
        <button type="button" on:click={deleteApp}>Delete App</button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .app-wrapper {
    display: inline-block;

    a, div {
      text-decoration: none;
      color: inherit;

      img {
        width: 64px;
        height: 64px;
      }

      label {
        display: block;
        text-align: center;
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

        label {
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
