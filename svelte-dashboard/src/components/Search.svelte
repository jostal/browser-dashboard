<script>
  import { user } from "../stores/UserStore"
  import { globalState } from "../stores/GlobalStore";

  let searchVal = ''

  let handleSearch = () => {
    let searchUrl = $user.config.searchEngine.search_url + searchVal
    searchVal = ''

    window.location.href = searchUrl
  }

</script>

<div id="searchbar">
  <form on:submit|preventDefault={handleSearch}>
    <input type="search" placeholder="Search" value={searchVal} on:change={(e) => searchVal = e.target.value} name="search" />
    <button type="submit">Search</button>
  </form>
</div>
