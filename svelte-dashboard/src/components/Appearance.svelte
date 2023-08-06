<script>
  import { user } from "../stores/UserStore";
  import { globalState } from "../stores/GlobalStore";
  import ColorPicker from "svelte-awesome-color-picker"

  export let supabase
  export let configSupabase

  let bgUrl
  let showUpload = false
  let uploadedFile
  let imagePreview
  let hex

  let getBackground = async () => {
    if ($user.config.background.background_filepath) {
      let { data } = await supabase.storage.from('backgrounds').getPublicUrl($user.config.background.background_filepath)
      bgUrl = data.publicUrl
    } else {
      bgUrl = false
    }
  }

  let uploadFile = (file) => {
    uploadedFile = file
    imagePreview = URL.createObjectURL(file)
  }

  let changeBackground = async () => {
    let curDate = Date.now()
    const uploadRes = await supabase.storage.from('backgrounds').upload(`${curDate}-${uploadedFile.name}`, uploadedFile)
    if (uploadRes.error) {
      console.error(uploadRes.error)
    } else {
      const updateRes = await configSupabase.rpc('change_background_image', { 
        user_uuid: $user.session.user.id,
        background_path: curDate + '-' + uploadedFile.name
      }) 

      if (updateRes.error) {
        console.error(updateRes.error)
      } else {
        $user.refresh = true
        showUpload = false
      }
    }

  }

  let setBackgroundColor = async () => {
    const data = await $globalState.configSupabase.rpc('change_background_color', {
      user_uuid: $user.session.user.id,
      color: hex
    })

    if (data.error) {
      console.error(data.error)
    } else {
      $user.refresh = true
      showUpload = false
      getBackground()
    }
  }

  getBackground()

  $: if (($user.config.background.background_filepath && !bgUrl) || ($user.config.background.background_color && bgUrl)) {
    getBackground()
  }

</script>

<div class="settings">
  <h1>Appearance Settings</h1>
  <div class="img-preview" on:click={() => showUpload = true}>
    {#if bgUrl}
      <img src={bgUrl} alt="Selected background" />
    {:else}
      <div style={`background:${$user.config.background.background_color}`} class="bg-preview"></div>
    {/if}
    <div class="img-hover">Change Background</div>
  </div>

  {#if showUpload}
    <div class="popup-bg" on:click={() => showUpload = false}>
      <div class="background-settings" on:click|stopPropagation>
        <i class="material-symbols-outlined close" on:click={() => showUpload = false}>close</i>

        <div class="color-dialog">
          <h2>Set Background Color</h2>
          <div class="color-picker">
            <ColorPicker bind:hex canChangeMode={false} isAlpha={false} />
          </div>
          <button on:click={setBackgroundColor}>Set As Background</button> 
        </div>

        <hr />

        <div class="upload-dialog">
          <h2>Upload Background Image</h2>
          <input type="file" accept="image/*" on:input={(e) => uploadFile(e.target.files[0])} />
          {#if imagePreview}
            <img src={imagePreview} />
            <button on:click={changeBackground}>Upload</button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .settings {
    display: flex;
    flex-direction: column;
    align-items: center;

    .img-preview {
      position: relative;
      height: 113px;
      width: 200px;
      border: 1px solid #7a7979;

      img {
        width: 100%;
        height: 100%;
      }

      div {
        width: 100%;
        height: 100%;
      }

      .img-hover {
        width: calc(100% - 20px);
        height: fit-content;
        text-align: center;
        color: white;
        position: absolute;
        bottom: 0px;
        padding: 10px;
        background: rgb(0,0,0);
        background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.4) 81%, rgba(0,0,0,0.2) 100%); 
      }
    }

    .popup-bg {
      position: absolute;
      z-index: 10;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--popup-bg);
      border-radius: 0.5em;

      .background-settings {
        padding: 1em;
        margin-left: 20%;
        background: var(--bg-color);
        position: relative;
        border-radius: 0.5em;

        .close {
          position: absolute;
          top: 5px;
          right: 5px;
          cursor: pointer;
        }

        .color-dialog {
          display: flex;
          flex-direction: column;
          margin-bottom: 1em;
        }

        button {
          padding: 0.75em;
          margin-top: 1.5em;
          background: #22c55e;
          color: white;
          border: 1px solid #15803d;
          border-radius: 0.3em;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 1);
          font-weight: bold;
          cursor: pointer;
        }

        .upload-dialog {
          width: fit-content;
          display: flex;
          flex-direction: column;
          gap: 10px;

          img {
            width: 112px;
            height: 63px;
          }

          button {
            margin: 0;
          }
        }
      }

    }
  }
</style>
