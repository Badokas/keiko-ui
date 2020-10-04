<script>
  import { onMount } from "svelte";
  import { store } from "./store.js";
  import { NS } from "./names";
  import DragRect from "./DragRect.svelte";
  import GhostDiv from "./GhostDiv.svelte";

  let hostRef;
  let sizerRef;

  let visiblePatchArea = { w: 100, h: 100 };
  let scrollPosition = { x: 0, y: 0 };

  onMount(() => {
    measureVisiblePatchArea();
    console.log("mount", visiblePatchArea);
  });

  function measureVisiblePatchArea() {
    const clientW = hostRef.clientWidth;
    const clientH = hostRef.clientHeight;
    visiblePatchArea = { w: clientW, h: clientH };
  }

  function onHostScroll(e) {
    // console.log("host scroll", e);
    scrollPosition = {
      x: e.currentTarget.scrollLeft,
      y: e.currentTarget.scrollTop
    };
  }

  function onBgDblclick(e) {
    console.log("bg clicked", e.x, e.y);
    store.addBox(e.x, e.y);
  }
</script>

<style>
  host {
    width: 350px;
    height: 300px;
    display: block;
    position: relative;
    background: repeat
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect class="patternDots" x="19" y="19" width="1" height="1" /></svg>')
      palevioletred;
    background-attachment: local;

    overflow: scroll;
    overscroll-behavior: contain;
  }

  sizer {
    position: absolute;
    /* width: 500px;
    height: 600px; */

    pointer-events: none;

    display: block;
  }

  .svg_patcher {
    position: absolute;
  }

  .bgrect {
    fill: rgba(255, 255, 255, 0.1);
  }
</style>

<main>
  <host bind:this={hostRef} on:scroll={onHostScroll}>
    <GhostDiv x={visiblePatchArea.w} y={visiblePatchArea.h} />

    {#each Object.values($store[NS.BOXES]) as box, i (box.name)}
      <GhostDiv x={box.x} y={box.y} />
    {/each}
    <svg
      class="svg_patcher"
      width="{visiblePatchArea.w}px"
      height="{visiblePatchArea.h}px"
      style="left: {scrollPosition.x}px; top: {scrollPosition.y}px">
      <rect
        class="bgrect"
        width="100%"
        heigh="100%"
        on:dblclick={onBgDblclick} />
      <g
        style={`transform-origin: 0px 0px; transform: translate(-${scrollPosition.x}px, -${scrollPosition.y}px)`}>
        {#each Object.values($store[NS.BOXES]) as box, i (box.name)}
          <DragRect name={box.name} x={box.x} y={box.y} />
        {/each}
      </g>
    </svg>
  </host>
  <p>Gengo: waka</p>
</main>
