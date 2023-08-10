<script>
  import { onMount } from "svelte";
  import { user } from "../stores/UserStore";
  import { parseDate } from "../utils/clock";

  export let is24Hour;

  let date = new Date();

  $: time = date.toLocaleTimeString([], {
    hour12: !is24Hour,
  });

  $: formattedDate = parseDate(date, $user.config.clock.date_format);

  onMount(() => {
    const timerId = setInterval(() => {
      date = new Date();
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  });
</script>

<div class="time-container">
  <div class="date" style={`font-size: ${$user.config.clock.date_size}em`}>
    {formattedDate}
  </div>
  <div class="time" style={`font-size: ${$user.config.clock.time_size}em`}>
    {time}
  </div>
</div>

<style lang="scss">
  .time-container {
    text-align: center;
    font-weight: bold;
    text-shadow: var(--text-shadow);

    .date {
      margin-bottom: 1em;
    }
  }
</style>
