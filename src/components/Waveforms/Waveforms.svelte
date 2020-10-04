<script>
  import Wave from "./Wave.svelte";

  let speed = 3000;

  function onSpeedChange(e) {
    console.log("speed change:", e.target.value);
    speed = e.target.value;
  }
</script>

<style>
  main {
    height: 100%;
    margin: 0;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
  div {
    align-items: center;
    border: 4px solid #262626;
    display: flex;
    height: 110px;
    margin: 0 auto;
    width: 110px;
  }
</style>

<main>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="110px"
      height="110px"
      viewBox="5 0 80 60">
      <Wave {speed} />
    </svg>
  </div>

  <label for="speed">🏎</label>
  <input
    id="speed"
    type="range"
    min="70"
    max="3000"
    value={speed}
    class="slider"
    on:input={onSpeedChange} />
</main>
