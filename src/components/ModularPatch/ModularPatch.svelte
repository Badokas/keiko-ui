<script>
  import { setContext } from "svelte";
  import { store } from "./store.js";
  import Inout from "./Inout.svelte";
  import PatchLine from "./PatchLine.svelte";
  import PossibleLine from "./PossibleLine.svelte";

  let possibleLine = {
    visible: false,
    type: "in",
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0 },
    dataType: "event"
  };
  let myContext = {
    showPossibleLine,
    hidePossibleLine
  };

  function showPossibleLine({ fromName, clickPoint }) {
    const box = $store.inouts.filter(item => item.name === fromName)[0];
    console.log("box", box);

    possibleLine = {
      ...possibleLine,
      visible: true,
      from: { x: box.x + 10, y: box.y + 10 },
      to: { ...clickPoint }
    };
  }

  function hidePossibleLine(params) {
    possibleLine = {
      ...possibleLine,
      visible: false
    };
  }

  setContext("patcher", myContext);
</script>

<style>
  svg {
    background-color: palevioletred;
  }
</style>

<svg width="400px" height="400px">
  {#each $store.inouts as io}
    <Inout name={io.name} x={io.x} y={io.y} />
  {/each}

  {#each $store.lines as line}
    <PatchLine {...line} />
  {/each}

  {#if possibleLine.visible}
    <PossibleLine {...possibleLine} />
  {/if}
</svg>
