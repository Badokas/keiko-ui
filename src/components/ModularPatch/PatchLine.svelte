<script>
  import { onMount } from "svelte";
  import { store } from "./store.js";
  import BaseLine from "./BaseLine.svelte";

  export let from;
  export let to;

  let fromInoutObj = $store.inouts.filter(item => item.name === from)[0];
  let toInoutObj = $store.inouts.filter(item => item.name === to)[0];
  let offset = 10;

  let coords = {
    x1: fromInoutObj.x + offset,
    y1: fromInoutObj.y + offset,
    x2: toInoutObj.x + offset,
    y2: toInoutObj.y + offset
  };

  onMount(() => {
    console.log(fromInoutObj);
  });
</script>

<BaseLine {...coords} />
