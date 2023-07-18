<script>

  export let app

</script>

<div class="app-wrapper">
  <a href={app.url}>
    <img src={`http://www.google.com/s2/favicons?sz=128&domain=${app.url}`} alt={`${app.name} icon`}/>
    <label>{app.name}</label>
  </a>
</div>

<style lang="scss">
  .app-wrapper {
    display: inline-block;

    a {
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
  }
</style>
