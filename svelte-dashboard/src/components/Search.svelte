<script>
  import { user } from "../stores/UserStore"
  import { globalState } from "../stores/GlobalStore";

  let searchVal = ''
  let searchPlaceholder = 'Search'
  let engineIcon

  let handleSearch = () => {
    let searchUrl = $user.config.searchEngine.search_url + searchVal
    searchVal = ''

    window.location.href = searchUrl
  }

  let getSearchIcon = async () => {
    const { data } = await $globalState.supabase.storage.from('assets').getPublicUrl(`icons/${$user.config.searchEngine.icon_path}`)
    engineIcon = data.publicUrl 
  }

  $: if ($user.config) {
    getSearchIcon()
    searchPlaceholder = 'Search ' + $user.config.searchEngine.name
  }
</script>

<div id="searchbar">
  <form on:submit|preventDefault={handleSearch}>
    <img class="search-icon" src="search.svg" alt="Search icon" on:click={handleSearch} />
    {#if engineIcon}
      <img class="engine-icon" src={engineIcon} alt={`${$user.config.searchEngine.name} icon`} />
    {/if}
    <input type="search" placeholder={searchPlaceholder} value={searchVal} on:change={(e) => searchVal = e.target.value} name="search" />
  </form>
</div>

<style lang="scss">
  #searchbar {
    width: 100%;
    
    form {
      position: relative;
      width: 100%;

      input {
        width: 100%;
        padding: 1em 1em 1em 55px;
        border: none;
        border-radius: 0.5em;
        box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
      }

      .search-icon {
        position: absolute;
        width: 35px;
        top: 5px;
        right: 0.5em;
      }

      .engine-icon {
        position: absolute;
        width: 35px;
        top: 5px;
        left: 0.5em;
      }
    }
  }
</style>
