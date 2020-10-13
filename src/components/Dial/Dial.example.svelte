<script>
  import { writable } from 'svelte/store';
  import Dial from './Dial.svelte';

  function onDialChange(e) {
    const { detail } = e;
    console.log(detail);
    // synth.updateParam(detail.id, detail.value);
  }
</script>

<Dial id="0" name="Test" on:change={onDialChange} />
