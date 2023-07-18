<script>
  import { user } from "../stores/UserStore";

  export let supabase
  export let configSupabase

  let bgUrl
  let showUpload = false
  let uploadedFile
  let imagePreview

  let getBackground = async () => {
    let { data } = await supabase.storage.from('backgrounds').getPublicUrl($user.config.background)
    bgUrl = data.publicUrl
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
      const updateRes = await configSupabase.rpc('change_background', { 
        user_uuid: $user.session.user.id,
        background_path: curDate + '-' + uploadedFile.name
      }) 

      if (updateRes.error) {
        console.error(updateRes.error)
      } else {
        $user.refresh = true
      }
    }

  }

  getBackground()

</script>

<div class="settings">
  <div class="img-preview" on:click={() => showUpload = true}>
    <img src={bgUrl} alt="Selected background" />
    <div class="img-hover">Upload Background</div>
  </div>

  {#if showUpload}
    <div class="upload-dialog">
      <input type="file" accept="image/*" on:input={(e) => uploadFile(e.target.files[0])} />
      {#if imagePreview}
        <img src={imagePreview} />
        <button on:click={changeBackground}>Upload</button>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .settings {
    .img-preview {
      position: relative;
      height: 113px;
      width: 200px;

      img {
        width: 100%;
        height: 100%;
      }

      .img-hover {
        width: calc(100% - 20px);
        text-align: center;
        color: white;
        position: absolute;
        bottom: 0px;
        padding: 10px;
        background: rgb(0,0,0);
        background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.4) 81%, rgba(0,0,0,0.2) 100%); 
      }
    }

    .upload-dialog {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      width: fit-content;
      border: 1px solid black;

      img {
        width: 32px;
        height: 18px;
      }
    }
  }
</style>
