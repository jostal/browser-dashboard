<script>
  import { user } from "../stores/UserStore";
  import { globalState } from "../stores/GlobalStore";

  export let refreshApps = () => {};

  let showCreate = false;
  let iconFile;
  let appConfig = {
    name: "",
    url: "",
  };

  let handleSaveApp = async () => {
    let iconPath = null;

    if (iconFile) {
      let curDate = Date.now();
      iconPath = `${curDate}-${iconFile.name}`;

      // upload icon
      const uploadRes = await $globalState.supabase.storage
        .from("app-icons")
        .upload(iconPath, iconFile);
    }

    const updateRes = await $globalState.supabase.rpc("save_app", {
      user_uuid: $user.session.user.id,
      app_id: null,
      app_name: appConfig.name,
      app_url: appConfig.url,
      icon: iconPath,
    });

    refreshApps();
    showCreate = false;
    appConfig.name = "";
    appConfig.url = "";
    iconFile = null;
    iconPath = null;
  };
</script>

<div id="newApp" class="app-wrapper">
  <div class="new-app-wrapper" on:click={() => (showCreate = true)}>
    <i class="material-symbols-outlined">add_circle</i>
    <label><strong>New App</strong></label>
  </div>

  {#if showCreate}
    <div class="popup-bg" on:click={() => (showCreate = false)}>
      <div id="edit-app-popup" on:click|stopPropagation>
        <h1>Create New App</h1>

        <i
          class="material-symbols-outlined close"
          on:click={() => (showCreate = false)}>close</i
        >

        <form on:submit={handleSaveApp}>
          <label for="app-name">Name <i class="required-field">*</i></label>
          <input
            type="text"
            name="app-name"
            value={appConfig.name}
            on:change={(e) => (appConfig.name = e.target.value)}
            required
          />

          <label for="app-url">URL <i class="required-field">*</i></label>
          <input
            type="url"
            name="app-url"
            value={appConfig.url}
            on:change={(e) => {
              appConfig.url = e.target.value;
              e.target.setCustomValidity("");
            }}
            on:invalid={(e) =>
              e.target.setCustomValidity(
                "Please enter a URL. Make sure to include the protocol (https://, etc...)"
              )}
            required
          />

          <div class="icon-preview">
            <label for="icon-upload"
              ><i class="material-symbols-outlined upload">upload</i>Upload
              Custom Icon</label
            >
            {#if iconFile}
              <img src={URL.createObjectURL(iconFile)} alt="Icon Preview" />
            {/if}
            <input
              name="icon"
              id="icon-upload"
              type="file"
              accept="image/*"
              on:input={(e) => (iconFile = e.target.files[0])}
            />
          </div>

          <button type="submit"
            ><i class="material-symbols-outlined save">save</i>Save</button
          >
        </form>
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
        text-shadow: var(--text-shadow);
      }

      label {
        text-shadow: var(--text-shadow);
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

        .icon-preview {
          margin-top: 1em;

          input {
            display: none;
          }

          label {
            padding: 0.5em;
            border: 1px solid black;
            background: var(--contrast-bg);
            color: var(--bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            i {
              margin-right: 5px;
            }
          }
        }

        img {
          width: 64px;
          height: 64px;
        }

        button {
          margin-top: 1em;
          padding: 0.5em;
          font-weight: bold;
          display: flex;
          align-items: center;
          border-radius: 0.3em;
          color: white;
          text-shadow: 1px 1px 3px rgb(0, 0, 0);
          background: #22c55e;
          border: 1px solid #15803d;

          i {
            margin-right: 5px;
          }
        }

        label {
          display: block;
          text-align: left;
          margin-top: 10px;
          margin-bottom: 5px;

          .required-field {
            color: #f03a30;
          }

          &:first-child {
            margin-top: 0;
          }
        }

        input {
          padding: 0.5em;
          border-radius: 0.3em;
          border: 1px solid black;
        }
      }
    }
  }
</style>
