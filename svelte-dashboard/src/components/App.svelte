<script>
  import { onMount } from "svelte";
  import { globalState } from "../stores/GlobalStore";
  import { user } from "../stores/UserStore";

  export let app;
  export let refreshApps = () => {};

  let showEdit;
  let newIconPreview;
  let newIconFile;
  let hasDefaultIcon = true;
  let appConfig = {
    id: app.id,
    name: app.name,
    url: app.url,
    icon: null,
  };

  $: app, assignIcon();

  async function assignIcon() {
    appConfig.icon = await getIconUrl(app.icon_path);
  }

  onMount(async () => {
    appConfig.icon = await getIconUrl(app.icon_path);
  });

  async function getIconUrl(icon_path) {
    // check if file exists
    let existsRes;

    if (icon_path) {
      existsRes = await $globalState.supabase.storage
        .from("app-icons")
        .list("", {
          search: icon_path,
        });

      hasDefaultIcon = false;
    }

    let icon = `https://www.google.com/s2/favicons?sz=128&domain=${app.url}`;

    if (existsRes?.data.length > 0 && icon_path) {
      let { data } = await $globalState.supabase.storage
        .from("app-icons")
        .getPublicUrl(icon_path);
      icon = data.publicUrl;
    }

    return icon;
  }

  let useDefaultIcon = async () => {
    newIconPreview = null;
    newIconFile = null;
    appConfig.icon = await getIconUrl(null);
    hasDefaultIcon = true;
  };

  let uploadIcon = (e) => {
    newIconPreview = URL.createObjectURL(e.target.files[0]);
    newIconFile = e.target.files[0];
    hasDefaultIcon = false;
  };

  let updateApp = async () => {
    let curDate = Date.now();
    let iconPath;
    if (newIconFile) {
      const uploadRes = await $globalState.supabase.storage
        .from("app-icons")
        .upload(`${curDate}-${newIconFile.name}`, newIconFile);
      iconPath = `${curDate}-${newIconFile.name}`;
    }

    const updateRes = await $globalState.supabase.rpc("save_app", {
      user_uuid: $user.session.user.id,
      app_id: appConfig.id,
      app_name: appConfig.name,
      app_url: appConfig.url,
      icon: hasDefaultIcon ? null : iconPath ? iconPath : app.icon_path,
    });

    refreshApps();
    showEdit = false;
  };

  let deleteApp = async () => {
    const deleteRes = await $globalState.supabase.rpc("delete_app", {
      app_id: appConfig.id,
    });

    refreshApps();
    showEdit = false;
  };
</script>

<div class="app-wrapper" draggable="false">
  {#if $globalState.editMode}
    <div class="edit-app" on:click={() => (showEdit = true)} draggable="false">
      <img src={appConfig.icon} alt={`${app.name} icon`} draggable="false" />
      <label>{app.name}</label>
    </div>
  {:else}
    <a href={app.url}>
      <img src={appConfig.icon} alt={`${app.name} icon`} />
      <label>{app.name}</label>
    </a>
  {/if}

  {#if showEdit}
    <div class="popup-bg" on:click={() => (showEdit = false)}>
      <div id="edit-app-popup" on:click|stopPropagation>
        <i
          class="material-symbols-outlined close"
          on:click={() => (showEdit = false)}>close</i
        >
        <h1>Edit App Details</h1>
        <form on:submit={updateApp}>
          <div class="icon-preview">
            <h2>Change Icon</h2>
            <div class="icon-upload">
              <img
                src={newIconPreview ? newIconPreview : appConfig.icon}
                alt={`${app.name} icon`}
              />
              <div class="icon-actions">
                <label for="app-icon-upload"
                  ><i class="material-symbols-outlined upload">upload</i>Upload
                  Icon</label
                >
                <button on:click={useDefaultIcon}>Use Default Icon</button>
              </div>
              <input
                type="file"
                accept="image/*"
                id="app-icon-upload"
                on:input={(e) => uploadIcon(e)}
              />
            </div>
          </div>
          <h2>Change Info</h2>
          <label for="app-url">URL</label>
          <input
            type="url"
            name="app-url"
            value={appConfig.url}
            on:change={(e) => (appConfig.url = e.target.value)}
            required
          />
          <label for="app-name">Name</label>
          <input
            type="text"
            name="app-name"
            value={appConfig.name}
            on:change={(e) => (appConfig.name = e.target.value)}
          />

          <div class="btn-actions">
            <button type="submit" class="btn-save"
              ><i class="material-symbols-outlined">save</i>Save</button
            >
            <button type="button" class="btn-delete" on:click={deleteApp}
              ><i class="material-symbols-outlined">delete</i>Delete App</button
            >
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .app-wrapper {
    display: inline-block;
    text-shadow: var(--text-shadow);
    padding: 1em;
    cursor: pointer;

    &:hover {
      background-color: var(--hover);
      border-radius: 1em;
    }

    a,
    div {
      text-decoration: none;
      color: inherit;

      img {
        width: 64px;
        height: 64px;
      }

      label {
        display: block;
        text-align: center;
        margin-top: 7px;
        cursor: pointer;
        font-weight: bold;
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
        text-shadow: none;
        cursor: default;

        .icon-preview {
          .icon-upload {
            display: flex;
            flex-direction: column;

            .icon-actions {
              display: flex;
              margin-top: 1em;
              gap: 1em;

              button {
                cursor: pointer;
                border: 1px solid #8c8c8e;
                padding: 8px;
                color: black;
              }
            }

            input {
              display: none;
            }

            label {
              padding: 8px;
              display: flex;
              align-items: center;
              border: 1px solid black;
              width: fit-content;
              margin: 0;
              background: var(--contrast-bg);
              color: var(--bg-color);

              .upload {
                margin-right: 5px;
              }
            }

            img {
              width: 64px;
            }
          }
        }

        .close {
          position: absolute;
          top: 5px;
          right: 5px;
          cursor: pointer;
        }

        label {
          text-align: left;
          margin-top: 15px;
          margin-bottom: 10px;

          &:first-child {
            margin-top: 0;
          }
        }

        input {
          padding: 0.5em;
          border-radius: 0.3em;
          border: 1px solid black;
          display: block;
        }

        .btn-actions {
          margin-top: 1em;
          display: flex;
          gap: 1em;

          button {
            color: white;
            display: flex;
            align-items: center;
            padding: 0.5em;
            text-shadow: 1px 1px 3px rgb(0, 0, 0);
            border-radius: 0.3em;
            font-weight: bold;
            cursor: pointer;

            i {
              margin-right: 5px;
            }
          }

          .btn-save {
            background: #22c55e;
            border: 1px solid #15803d;
          }

          .btn-delete {
            background: #f03a30;
            border: 1px solid #90231d;
          }
        }
      }
    }
  }
</style>
