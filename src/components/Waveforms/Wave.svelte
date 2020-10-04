<script>
  export let speed = 3000;

  function buildWave(w, h) {
    const m = 0.512286623256592433;
    const pathData = [
      "M",
      0,
      h * 0.625,
      "c",
      0.25 * h * m,
      0,
      0.25 * h * (1 - m),
      -0.25 * h,
      0.25 * h,
      -0.25 * h,
      "s",
      0.25 * h * (1 - m),
      0.25 * h,
      0.25 * h,
      0.25 * h,
      "s",
      0.25 * h * (1 - m),
      -0.25 * h,
      0.25 * h,
      -0.25 * h,
      "s",
      0.25 * h * (1 - m),
      0.25 * h,
      0.25 * h,
      0.25 * h,
      "s",
      0.25 * h * (1 - m),
      -0.25 * h,
      0.25 * h,
      -0.25 * h,
      "s",
      0.25 * h * (1 - m),
      0.25 * h,
      0.25 * h,
      0.25 * h,
      "s",
      0.25 * h * (1 - m),
      -0.25 * h,
      0.25 * h,
      -0.25 * h,
      "s",
      0.25 * h * (1 - m),
      0.25 * h,
      0.25 * h,
      0.25 * h,
      "s",
      0.25 * h * (1 - m),
      -0.25 * h,
      0.25 * h,
      -0.25 * h,
      "s",
      0.25 * h * (1 - m),
      0.25 * h,
      0.25 * h,
      0.25 * h,
      "s",
      0.25 * h * (1 - m),
      -0.25 * h,
      0.25 * h,
      -0.25 * h,
      "s",
      0.25 * h * (1 - m),
      0.25 * h,
      0.25 * h,
      0.25 * h,
      "s",
      0.25 * h * (1 - m),
      -0.25 * h,
      0.25 * h,
      -0.25 * h
    ].join(" ");

    return pathData;
  }
</script>

<style>
  .wave {
    fill: none;
    stroke: #333;
    stroke-width: 4;
    animation: moveTheWave 3000ms linear infinite;
    stroke-linecap: round;
    stroke-dasharray: 0 16 101 16;
  }

  @keyframes moveTheWave {
    0% {
      stroke-dashoffset: 0;
      transform: translate3d(0, 0, 0);
    }
    100% {
      stroke-dashoffset: -133;
      transform: translate3d(-90px, 0, 0);
    }
  }
</style>

<path
  class="wave"
  d={buildWave(90, 60)}
  style="animation-duration: {speed}ms" />
