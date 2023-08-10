<script>
  import { onMount } from "svelte";
  import { user } from "../stores/UserStore";
  import { globalState } from "../stores/GlobalStore";
  import { parseDate } from "../utils/clock.js";

  let showClock = $user.config.clock.show_clock;
  let use24Hour = $user.config.clock.use_24h_clock;
  let showDate = $user.config.clock.show_date;
  let dateFormat = $user.config.clock.date_format;
  let dateSize = $user.config.clock.date_size;
  let timeSize = $user.config.clock.time_size;
  let formatHelp = false;
  let previewDate = new Date();
  let formatPreview;

  async function updateClock() {
    await $globalState.configSupabase.rpc("change_clock", {
      user_uuid: $user.session.user.id,
      enable_clock: showClock,
      is_24h_clock: use24Hour,
      enable_date: showDate,
      format_date: dateFormat,
      date_font: dateSize,
      time_font: timeSize,
    });

    $user.refresh = true;
  }

  $: if (showClock !== $user.config.clock.show_clock) updateClock();
  $: if (use24Hour !== $user.config.clock.use_24h_clock) updateClock();
  $: if (showDate !== $user.config.clock.show_date) updateClock();
  $: dateFormat, (formatPreview = parseDate(previewDate, dateFormat));
</script>

<div class="settings">
  {#if formatHelp}
    <div class="popup-bg" on:click={() => (formatHelp = false)}>
      <div class="format-help" on:click|stopPropagation>
        <i
          class="material-symbols-outlined close"
          on:click={() => (formatHelp = false)}>close</i
        >

        <h1>Date Format Help</h1>
        <p>
          A date format consists of one or more date specifiers that will be
          replaced with the current date info. For example:
        </p>
        <code>
          If the date is January 1st, 2000:<br /><br />
          "dd/MM/yyyy" = "01/01/2000",<br />
          "dddd, MMMM dd, yyyy" = "Saturday, January 1, 2000"
        </code>
        <h2>Date Format Specifiers</h2>
        <table class="format-spec">
          <tr>
            <th>Format specifier</th>
            <th>Format type</th>
            <th>Description</th>
            <th>Example for 01/01/2023</th>
          </tr>
          <tr class="day">
            <td>d</td>
            <td>Day of Month</td>
            <td>Numerical day of month with no leading zero</td>
            <td>1</td>
          </tr>
          <tr class="day">
            <td>dd</td>
            <td>Day of Month</td>
            <td>Numerical day of month with leading zero if single-digit</td>
            <td>01</td>
          </tr>
          <tr class="day">
            <td>ddd</td>
            <td>Day of Week</td>
            <td>Three-letter abbreviation for the day of the week</td>
            <td>Sun</td>
          </tr>
          <tr class="day">
            <td> dddd </td>
            <td>Day of Week</td>
            <td>Full name for the day of the week</td>
            <td>Sunday</td>
          </tr>
          <tr class="month">
            <td>M</td>
            <td>Month</td>
            <td>Numerical month with no leading zero</td>
            <td>1</td>
          </tr>
          <tr class="month">
            <td>MM</td>
            <td>Month</td>
            <td>Numerical month with leading zero if single-digit</td>
            <td>01</td>
          </tr>
          <tr class="month">
            <td>MMM</td>
            <td>Month</td>
            <td>Three-letter abbreviation for the month</td>
            <td>Jan</td>
          </tr>
          <tr class="month">
            <td>MMMM</td>
            <td>Month</td>
            <td>Full name for the month</td>
            <td>January</td>
          </tr>
          <tr class="year">
            <td>yy</td>
            <td>Year</td>
            <td>Year as last two digits</td>
            <td>23</td>
          </tr>
          <tr class="year">
            <td>yyyy</td>
            <td>Year</td>
            <td>Year represented by 4 digits</td>
            <td>2023</td>
          </tr>
        </table>
      </div>
    </div>
  {/if}
  <h1>Widget Settings</h1>
  <hr />
  <h2>Clock Widget</h2>
  <div class="checkbox">
    <input
      id="toggleClock"
      name="toggleClock"
      type="checkbox"
      bind:checked={showClock}
    />
    <label for="toggleClock"> Show clock widget </label>
  </div>
  <div class="checkbox">
    <input id="toggle24Hour" type="checkbox" bind:checked={use24Hour} />
    <label for="toggle24Hour">Use 24 hour format</label>
  </div>
  <div class="checkbox">
    <input id="toggleDate" type="checkbox" bind:checked={showDate} />
    <label for="toggleDate">Show date</label>
  </div>
  <hr class="subdivide" />
  <div class="date-format">
    <div class="date-format-label">
      <label for="dateFormat"><strong>Date format</strong></label>
      <i
        class="material-symbols-outlined"
        title="Help with format"
        on:click={() => (formatHelp = true)}>help</i
      >
    </div>
    <input id="dateFormat" bind:value={dateFormat} />
    <p class="format-preview"><em>{formatPreview}</em></p>
    <button on:click={updateClock}>Update Date Format</button>
  </div>
  <hr class="subdivide" />
  <div class="clock-size">
    <label for="dateSize"><strong>Date size</strong></label>
    <input id="dateSize" type="number" step="0.1" bind:value={dateSize} />

    <label for="timeSize"><strong>Time size</strong></label>
    <input id="timeSize" type="number" step="0.1" bind:value={timeSize} />

    <button on:click={updateClock}>Update Sizes</button>
  </div>
</div>

<style lang="scss">
  .settings {
    .subdivide {
      color: var(--hover);
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

      .format-help {
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

        .format-spec {
          border-collapse: collapse;

          th {
            border: 1px solid var(--contrast-bg);
            border-bottom: 2px solid;
            padding: 0.5em;
          }

          td {
            border: 1px solid var(--contrast-bg);
            padding: 0.5em;
          }

          .day {
            background: #25331f;
          }

          .month {
            background: #33301f;
          }

          .year {
            background: #301f33;
          }
        }
      }
    }

    .checkbox {
      margin-bottom: 1em;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;

      input {
        width: 1.3em;
        height: 1.3em;
      }
    }

    .date-format {
      .date-format-label {
        display: flex;
        align-items: center;
        gap: 10px;

        i {
          cursor: pointer;
        }
      }

      input {
        display: block;
        padding: 0.5em;
        margin-top: 5px;
      }

      button {
        margin-top: 5px;
        padding: 0.75em;
        background: #22c55e;
        color: white;
        border: 1px solid #15803d;
        border-radius: 0.3em;
        text-shadow: 1px 1px 3px rgb(0, 0, 0);
        cursor: pointer;
        font-weight: bold;
      }
    }

    .clock-size {
      label {
        margin-top: 1em;
        display: block;
      }

      input {
        display: block;
        padding: 0.5em;
        margin-top: 5px;
      }

      button {
        margin-top: 5px;
        padding: 0.75em;
        background: #22c55e;
        color: white;
        border: 1px solid #15803d;
        border-radius: 0.3em;
        text-shadow: 1px 1px 3px rgb(0, 0, 0);
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
</style>
