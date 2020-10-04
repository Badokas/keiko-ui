<script>
  import { getContext } from "svelte";
  import BaseLine from "./BaseLine.svelte";
  export let from = { x: 0, y: 0 };
  export let to = { x: 100, y: 100 };

  let mouseCoords = [];
  const context = getContext("patcher");

  let coords = { x1: from.x, y1: from.y, x2: to.x, y2: to.y };

  function onMouseMove(e) {
    if (mouseCoords.length === 0) {
      mouseCoords = [e.pageX, e.pageY];
    }

    const dx = mouseCoords[0] - e.pageX;
    const dy = mouseCoords[1] - e.pageY;

    coords.x2 = to.x - dx;
    coords.y2 = to.y - dy;
  }
</script>

<svelte:window on:mousemove={onMouseMove} />
<BaseLine {...coords} />
