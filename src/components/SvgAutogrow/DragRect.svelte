<script>
  import { store } from "./store.js";
  import { useGlobalMouseMove, useGlobalMouseUp } from "./hooks.js";

  export let name;
  export let x = 0;
  export let y = 0;

  let isMouseDown = false;
  let clickPos = { x: 0, y: 0 };

  const onGlobalMouseMove = useGlobalMouseMove(e => {
    if (!isMouseDown) return;
    console.log("move", e.movementX, e.movementY);

    store.setPositionDelta(name, e.movementX, e.movementY);
  });

  const onGlobalMouseUp = useGlobalMouseUp(onMouseUp);

  function onMouseDown(e) {
    console.log("dragrect md");
    isMouseDown = true;
    clickPos = { x: e.x, y: e.y };

    onGlobalMouseMove(true);
    onGlobalMouseUp(true);
  }

  function onMouseUp(e) {
    console.log("dragrect mu");
    isMouseDown = false;

    onGlobalMouseMove(false);
    onGlobalMouseUp(false);
  }

  function onDoubleClick() {
    store.removeBox(name);
  }
</script>

<rect
  {x}
  {y}
  width="20"
  height="20"
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:dblclick={onDoubleClick} />
