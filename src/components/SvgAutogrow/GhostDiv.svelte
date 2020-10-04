<script>
  export let x = 0;
  export let y = 0;
</script>

<style>
  div {
    width: 20px;
    height: 20px;
    /* background-color: red; */
    border: 1px solid white;
    position: absolute;
    pointer-events: none;
    margin: 15px;
    z-index: 1;
  }
</style>

<div style="color: green; left: {x}px; top: {y}px" />
