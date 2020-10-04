<script>
  import Welcome from "./components/Welcome/Welcome.svelte";
  import SvgAutogrow from "./components/SvgAutogrow/SvgAutogrow.svelte";
  import Waveforms from "./components/Waveforms/Waveforms.svelte";
  import ModularPatch from "./components/ModularPatch/ModularPatch.svelte";
  import LooperUi from "./components/LooperUi/LooperUi.svelte";
  import WaveSin from "./components/WaveSin/WaveSin.svelte";

  let currentComponent = Welcome;

  const components = {
    Welcome: Welcome,
    SvgAutogrow: SvgAutogrow,
    Waveforms: Waveforms,
    ModularPatch: ModularPatch,
    LooperUi: LooperUi,
    WaveSin: WaveSin
  };

  async function changeComponent(e) {
    const val = e.target.firstChild.textContent;
    currentComponent = components[val];
  }
</script>

<style>
  host {
    display: flex;
  }

  side {
    width: 140px;
    /* height: 100%; */
    /* background: lightblue; */
    border: 2px solid lightblue;
    padding: 0;
    border-radius: 5px;
  }

  side ul {
    list-style-type: none;
    padding: 10px;
    margin: 0;
  }

  side ul li {
    margin-bottom: 6px;
    background: lightcyan;
    border-radius: 3px;
    padding: 2px;
    cursor: pointer;
  }

  main {
    margin: 0 10px;
  }
</style>

<host>
  <side>
    <ul>
      {#each Object.keys(components) as item}
        <li on:click={changeComponent}>{item}</li>
      {/each}
    </ul>
  </side>
  <main>
    <svelte:component this={currentComponent} />
  </main>
</host>
