<script context="module">
  // * is-number <https://github.com/jonschlinkert/is-number>
  function isNumber(num) {
    if (typeof num === 'number') {
      return num - num === 0;
    }
    if (typeof num === 'string' && num.trim() !== '') {
      return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
  }

  function formatNumber(num, style) {
    if (typeof num !== 'number') {
      num = parseFloat(num);
    }

    switch (style) {
      case 'int':
        return Math.trunc(num) + '';
      case 'percent':
        return num.toLocaleString(undefined, { style: 'percent' });
      case 'float':
      default:
        return num.toFixed(2);
    }
  }
</script>

<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';

  export let value = 0;
  export let type = 'float';
  export let items = [];
  export let unitStyle = 'int';
  export let isFocused = false;
  export let style = '';
  export let extraClasses = '';

  const dispatch = createEventDispatcher();
  let inputRef;
  let inputVal = '';
  let hasGainedFocus = false;

  $: if (isFocused) hasGainedFocus = true;

  afterUpdate(() => {
    if (hasGainedFocus) {
      hasGainedFocus = false;
      inputRef.focus();
    }
  });

  function onInput(e) {
    console.log('[NumInput] on input');
    if (isNumber(e.data) || e.data === null || e.data === '.') {
      if (e.target.value !== '') inputVal = e.target.value;
    } else {
      e.target.value = inputVal;
    }
  }

  function onFocus(e) {
    console.log('[NumInput] on focus');

    inputVal = formatNumber(value, unitStyle);
    e.target.value = inputVal;
    e.target.setSelectionRange(0, e.target.value.length);
  }

  function onBlur(e) {
    const _val = parseFloat(e.target.value);
    if (isNumber(_val) && value !== _val) dispatch('change', _val);
    // isFocused = false;
  }
</script>

<style>
  input {
    background-color: inherit;
    width: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-align: inherit;
    color: inherit;
    outline: none;
    border: none;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

{#if isFocused}
  <!-- svelte-ignore a11y-autofocus -->
  <input
    bind:this={inputRef}
    type="text"
    tabindex="-1"
    class="num-input {extraClasses}"
    {style}
    on:focus={onFocus}
    on:blur={onBlur}
    on:input={onInput}
    on:copy|preventDefault
    on:paste|preventDefault
    on:contextmenu|preventDefault />
{:else}{type === 'enum' ? items[value] : formatNumber(value, unitStyle)}{/if}
