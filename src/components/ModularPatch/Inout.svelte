<script context="module">
  const INOUT_STATES = {
    PASSIVE: 0,
    STANDOUT: 1,
    HOVER: 2,
    ACTIVE: 3
  };
</script>

<script>
  import { getContext, onMount } from "svelte";
  import { getCursorPositionInSvg } from "./helpers.js";

  export let name;
  export let x = 0;
  export let y = 0;

  let inoutState = INOUT_STATES.PASSIVE;
  let isMouseDown = false;
  let isHovered = false;
  let clickCoords = { x: 0, y: 0 };

  const context = getContext("patcher");

  function onMouseDown(e) {
    isMouseDown = true;

    const svgRef = e.path[2];
    clickCoords = { x: e.pageX, y: e.pageY };

    context.showPossibleLine({
      fromName: name,
      clickPoint: { ...getCursorPositionInSvg(svgRef, clickCoords, 1) }
    });
  }

  function onMouseUp(e) {
    isMouseDown = false;

    context.hidePossibleLine();
  }

  function onMouseOver(e) {
    isHovered = true;
  }

  function onMouseOut(e) {
    isHovered = false;
  }

  $: {
    if (isMouseDown) {
      inoutState = INOUT_STATES.ACTIVE;
    } else if (isHovered) {
      inoutState = INOUT_STATES.HOVER;
    } else {
      inoutState = INOUT_STATES.PASSIVE;
    }
  }
</script>

<style>
  .outer {
    fill: palegreen;
  }

  .inner {
    fill: black;
  }

  .hover {
    fill: white;
  }

  .active {
    fill: yellow;
  }
</style>

<svelte:window on:mouseup={onMouseUp} />

<g style="transform: translate(20, 20);">
  <circle
    class="outer"
    class:hover={inoutState === INOUT_STATES.HOVER}
    class:active={inoutState === INOUT_STATES.ACTIVE}
    r="10"
    cx={x + 10}
    cy={y + 10} />
  <circle class="inner" r="5" cx={x + 10} cy={y + 10} />
  <rect
    opacity="0"
    {x}
    {y}
    width="20"
    height="20"
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:mouseover={onMouseOver}
    on:mouseout={onMouseOut} />
</g>
