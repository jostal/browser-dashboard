<script>
  import { env } from "$env/dynamic/public";
  import ThirdPartyAuth from "./ThirdPartyAuth.svelte";
  import { user } from "../stores/UserStore";

  export let supabase;

  let authType = "Register";
  let error = "";

  let handleAuth = async (formEl) => {
    let formData = new FormData(formEl);

    if (authType === "Sign In") {
      let res = await supabase.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (res.error) {
        error = res.error.message;
      } else {
        $user.session = res.data;
        $user.refresh = true;
      }
    }

    if (authType === "Register") {
      if (validateCredentials(formData)) {
        error = "";
        let res = await supabase.auth.signUp({
          email: formData.get("email"),
          password: formData.get("password"),
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });

        if (res.error) {
          error = res.error.message;
        } else {
          $user.session = res.data;
          $user.refresh = true;
        }
      } else {
        error = "Passwords must match";
      }
    }
  };

  let validateCredentials = (formData) => {
    if (formData.get("password") !== formData.get("confirmPassword")) {
      return false;
    }

    return true;
  };

  let handleThirdPartyAuth = (provider) => {};
</script>

<section id="auth-form">
  <div class="button-group">
    <button
      on:click={() => {
        authType = "Sign In";
        error = "";
      }}
      class={authType === "Sign In" ? "active" : ""}>Sign In</button
    >
    <button
      on:click={() => {
        authType = "Register";
        error = "";
      }}
      class={authType === "Register" ? "active" : ""}>Register</button
    >
  </div>

  <form on:submit|preventDefault={(e) => handleAuth(e.target)}>
    <h1>{authType}</h1>
    {#if error !== ""}
      <p class="error"><strong>Error: </strong>{error}</p>
    {/if}

    {#if authType === "Sign In"}
      <label for="email">Email</label>
      <input name="email" type="email" />

      <label for="password">Password</label>
      <input name="password" type="password" />

      <button type="submit">{authType}</button>
    {:else}
      <label for="email">Email</label>
      <input name="email" type="email" />

      <label for="password">Password</label>
      <input name="password" type="password" />

      <label for="confirmPassword" type="password">Confirm Password</label>
      <input name="confirmPassword" type="password" />

      <button type="submit">{authType}</button>
    {/if}
    <!-- <div id="thirdPartyAuth"> -->
    <!--   <ThirdPartyAuth provider="github" handleAuth={handleThirdPartyAuth} /> -->
    <!-- </div> -->
  </form>
</section>

<style lang="scss">
  #auth-form {
    background: var(--bg-color);
    border-radius: 0.5em;
    width: 75%;
    max-width: 750px;
    min-width: 330px;

    .button-group {
      display: flex;
      width: 100%;
      font-size: 16px;

      button {
        width: 50%;
        padding: 8px;
        border: none;
        background: #54b4d3;
        color: white;
        font-weight: bold;
        cursor: pointer;

        &.active {
          background-color: #4ca2be;
          border: 1px solid #3b7e94;
        }

        &:first-child {
          border-radius: 0.5em 0 0 0;
        }

        &:last-child {
          border-radius: 0 0.5em 0 0;
        }
      }
    }

    form {
      padding: 10px;
      display: flex;
      flex-direction: column;

      .error {
        padding: 4px;
        background: #ef4444;
        color: #fef2f2;
      }

      label {
        display: block;
        width: calc(100% - 20px);
        margin-bottom: 4px;
      }

      input {
        margin-bottom: 15px;
        display: block;
        width: calc(100% - 20px);
        padding: 5px;
        font-size: 16px;
      }

      button {
        padding: 5px;
        font-size: 16px;
        width: 50%;
        border: 1px solid #16a34a;
        background: #4ade80;
        border-radius: 0.3em;
      }
    }
  }
</style>
