<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let x1 = 0;
  export let y1 = 0;
  export let x2 = 100;
  export let y2 = 100;

  let cx1 = 0,
    cy1 = 0,
    cx2 = 0,
    cy2 = 0;
  let bezPoints = writable(calcBezierPoints(x1, y1, x2, y2));

  function calcBezierPoints(x1, y1, x2, y2) {
    const diff_x = x1 - x2;
    const diff_y = y1 - y2;

    console.log("diff", diff_x, diff_y);

    const abs_x = Math.abs(diff_x === 0 ? 1 : diff_x);
    const abs_y = Math.abs(diff_y === 0 ? 1 : diff_y);

    // const gravityFactor = Math.min((abs_x + abs_y) * 0.4, 40);
    const gravityFactor = 40;

    const shouldSecondGoUp = y2 > y1 ? -1 : 1;

    const bez_delta_x1 = -(diff_x / 3);
    const bez_delta_y1 = gravityFactor + (y2 > y1 ? abs_y : diff_y / 5);

    const bez_delta_x2 = diff_x / 3;
    // const bez_delta_y2 = gravityFactor + (y2 < y1 ? abs_y : -(diff_y / 5));
    const bez_delta_y2 = gravityFactor + (y2 < y1 ? abs_y / 2 : -(diff_y / 5));

    x1 += bez_delta_x1;
    y1 += bez_delta_y1;
    x2 += bez_delta_x2;
    y2 += bez_delta_y2;

    return [x1, y1, x2, y2];
  }

  onMount(() => {
    [cx1, cy1, cx2, cy2] = calcBezierPoints(x1, y1, x2, y2);
    bezPoints.set([cx1, cy1, cx2, cy2], { hard: true });
  });

  $: {
    [cx1, cy1, cx2, cy2] = calcBezierPoints(x1, y1, x2, y2);
    bezPoints.set([cx1, cy1, cx2, cy2], { hard: true });
  }
</script>

<style>
  .line {
    fill: none;
    stroke: black;
    stroke-linecap: round;
    stroke-width: 2px;
  }
</style>

<path
  class="line"
  d="M {x1},{y1} C {$bezPoints[0]},{$bezPoints[1]}
  {$bezPoints[2]},{$bezPoints[3]}
  {x2},{y2}" />

<circle r="5" cx={$bezPoints[0]} cy={$bezPoints[1]} opacity="0.2" />
<circle r="5" cx={$bezPoints[2]} cy={$bezPoints[3]} opacity="0.2" />
