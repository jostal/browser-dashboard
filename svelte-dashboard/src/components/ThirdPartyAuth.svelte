<script>
  export let provider
  export let handleAuth
  let providerLogo

  if (provider === "github") {
    providerLogo = "https://cdn.josephtalon.ca/images/BrowserDashboard/logo-github.png"
  }

</script>

<div class="thirdPartyAuth">
  <button type="button" on:click={() => handleAuth(provider)}>
    <img src={providerLogo} alt="google logo" />
  </button>
</div>

<style lang="scss">
  .thirdPartyAuth {
    cursor: pointer;

    button {
      width: 45px;
      height: 45px;
      border: 1px solid black;
      background: none;
      padding: 5px;
      cursor: pointer;

      img {
        max-width: 100%;
      }
    }
  } 
</style>
