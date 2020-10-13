<script context="module">
  const defaultConf = {
    minValue: 0,
    maxValue: 1,
    range: 1,
    tickerRange: 25,
  };

  const defaultParam = {
    value: 0,
    defaultValue: 0,
    title: 'Untitled',
    type: 'float',
    items: [],
    minValue: 0,
    maxValue: 100,
    steps: 100,
    unitStyle: 'int',
    exponent: 1,
  };

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');

    return d;
  }

  function toRawValue(value, props) {
    // depends on params.: type, items, minValue, maxValue, exponent
    const params = {
      ...defaultParam,
      ...props,
    };
    if (params.type === 'enum') {
      return value / (params.items.length - 1);
    } else {
      const range = params.maxValue - params.minValue;
      return params.exponent !== 1
        ? Math.pow(value / range - params.minValue / range, 1 / params.exponent)
        : value / range - params.minValue / range;
    }
  }
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import NumInput from './NumInput.svelte';

  // props
  export let id;
  export let value = 0;
  export let defaultValue = 0;
  export let title = 'Untitled';
  export let type = 'float'; // oneOf.['float', 'int', enum]
  export let items = [];
  export let minValue = 0;
  export let maxValue = 100;
  export let steps = 100;
  export let unitStyle = 'int';
  export let exponent = 1;

  // Local component globals
  const dispatch = createEventDispatcher();
  let hostRef; // for synthetic focus
  let isMouseDown = false;
  let wasMouseMoved = false;
  let ticker = 0;
  let isFocused = false;
  let isInputFocused = false;
  // let clickPoint = 0;

  $: hasFocus = isFocused || isInputFocused;

  // used in svg drawing
  let degStart;
  let degEndOutline;
  let degTriangle;
  let degFull;
  let needleRotation;

  // Events
  //
  function onMouseDown(e) {
    // console.log('onMouseDown:', e);
    if (e.buttons === 1) {
      isMouseDown = true;
    }
  }

  function onMouseUp(e) {
    // isMouseDown = false;
    // console.log('onMouseUp:', e);
    if (!isMouseDown) return;

    isMouseDown = false;
    wasMouseMoved = false;

    // if (document.pointerLockElement === e.currentTarget) {
    document.exitPointerLock();
    ticker = 0;
    // }
  }

  function onMouseMove(e) {
    // console.log('onMouseMove:', e);
    if (!isMouseDown) return;

    if (!wasMouseMoved) {
      wasMouseMoved = true;
      e.currentTarget.requestPointerLock();
    } else if (document.pointerLockElement === e.currentTarget) {
      adjustValue(e.movementY * -1, e.shiftKey);
      // console.log('onMouseMove:', e.movementY, e);
      // console.log('onMouseMove:', e.currentTarget);
    }
  }

  function onDoubleClick(e) {
    if (e.target.classList.contains('dialinput')) {
      if (!isInputFocused) {
        isInputFocused = true;
      }
    } else {
      dispatchOnChange(defaultValue);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      adjustValue(1, e.shiftKey, true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      adjustValue(-1, e.shiftKey, true);
    } else if (e.key === 'Enter') {
      if (isInputFocused) {
        isInputFocused = false;
        hostRef.focus();
      } else {
        isInputFocused = true;
      }
    } else if (e.key === 'Escape') {
      if (isInputFocused) {
        isInputFocused = false;
        hostRef.focus();
      }
    }
  }

  function onWheel(e) {
    //* To improve performance further, make sure you’re throttling or debouncing your events
    if (!hasFocus) return;
    e.preventDefault();
    adjustValue(e.deltaY / 30 /* * -1 * __isMac */, e.shiftKey);
  }

  function onContextMenu() {
    // console.log('onContextMenu:', e);
    // nothing atm
  }

  function onInputChange(e) {
    console.log('[dial] change:', e.detail, typeof e.detail);
    updateValue(e.detail);
    isInputFocused = false;
  }

  // Inline functions
  //
  function adjustValue(ammount = 1, precission = false, bypass = false) {
    if (ammount === 0) return;
    const _steps = type === 'enum' ? items.length - 1 : steps;

    if (!bypass && _steps < 10) {
      if (Math.abs(ticker) < defaultConf.tickerRange) {
        // terminate early!
        ticker += ammount;
        return false;
      } else {
        // continue
        ammount = 1 * Math.sign(ammount);
        ticker = 0;
      }
    }

    const precissionMult = precission ? 0.1 : 1;

    const step = (defaultConf.range / _steps) * precissionMult;
    let internalValue = toRawValue(value, $$props) + ammount * step;
    // console.log('internal', internalValue);

    // clamp adjustment
    if (internalValue > defaultConf.maxValue) internalValue = defaultConf.maxValue;
    else if (internalValue < defaultConf.minValue) internalValue = defaultConf.minValue;

    // convert back
    const externalValue =
      type === 'enum'
        ? Math.round(internalValue * (items.length - 1))
        : Math.pow(internalValue, exponent) * (maxValue - minValue) + minValue;

    // console.log('external', externalValue);
    dispatchOnChange(externalValue);
  }

  function dispatchOnChange(_value) {
    if (_value === value) return;
    const target = {
      id,
      name,
      value: _value,
    };
    if (type === 'enum') target.enumValue = items[_value];

    dispatch('change', target);
  }

  function updateValue(val) {
    // clip
    if (type === 'enum') {
      if (val < 0) val = 0;
      else if (val > items.length - 1) val = items.length - 1;
    } else {
      if (val < minValue) val = minValue;
      else if (val > maxValue) val = maxValue;
    }

    dispatchOnChange(val);
  }

  //* Reactive drawing part
  $: {
    // params
    const dialValue = toRawValue(value, $$props);
    const triangleValue = toRawValue(defaultValue, $$props);

    // local config
    const pieSlice = 90;
    const startOffset = 0;
    const rotate = -45;

    // drawing calculus
    const fullCircleHack = pieSlice === 0 ? 0.001 : 0;
    const rotateExt = 180 - rotate;
    degStart = pieSlice / 2 - rotateExt; // 'degStartOutline' - specially for describeArc()
    const degEnd =
      pieSlice / 2 + startOffset + dialValue * (360 - pieSlice - startOffset);
    degEndOutline =
      pieSlice / 2 +
      startOffset +
      dialValue * (360 - pieSlice - startOffset) -
      rotateExt -
      fullCircleHack;
    degTriangle =
      pieSlice / 2 +
      startOffset +
      triangleValue * (360 - pieSlice - startOffset) -
      rotate * -1 -
      135;
    degFull =
      pieSlice / 2 +
      startOffset +
      (360 - pieSlice - startOffset) -
      rotateExt -
      fullCircleHack;
    // const calibRotation = rotate + 90;
    needleRotation = degEnd + rotate;
  }
</script>

<style>
  .dial {
    width: 54px;
    height: 64px;
    position: relative;
    white-space: nowrap;
    border-radius: var(--border-radius-single-comp);
    background-color: var(--color-bg-2);
    float: left; /* TODO: move to flexbox */
    margin: 0 3px 3px 0;
    font-size: 0.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    outline: 0 none;
    user-select: none;
  }

  .dial.hasFocus {
    box-shadow: 0 0 0 3px var(--focus-outline-color);
    outline: 0 none;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin: 0 2px;
  }

  .svg {
    width: 48px;
    height: 48px;
    margin-top: -2px;
  }

  .value {
    width: 22px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    font-family: 'Saira Extra Condensed';
    font-size: 13px;
    font-weight: 100;
    text-align: left;
    line-height: 16px;

    padding: 0;
    margin: 0;

    position: absolute;
    bottom: 2px;
    right: 2px;

    /* background-color: palevioletred; */
  }

  /* elems */

  .emptyOutline {
    stroke: rgb(209, 209, 209);
    stroke-width: 3px;
    fill: none;
    transform-origin: center;
    transform: translate(24px, 24px);
  }

  .filledOutline {
    stroke: rgb(0, 138, 255);
    stroke-width: 3px;
    fill: none;
    transform-origin: center;
    transform: translate(24px, 24px);
  }

  .triangle {
    fill: rgb(0, 138, 255);
    stroke: none;
  }

  .needle {
    stroke: #000;
    stroke-width: 3;
    fill: none;
  }

  .centerDot {
    stroke: none;
    fill: #000;
  }
</style>

<div
  class="dial"
  class:hasFocus
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:mousemove={onMouseMove}
  on:keydown={onKeyDown}
  on:wheel={onWheel}
  on:dblclick|preventDefault={onDoubleClick}
  on:contextmenu|preventDefault={onContextMenu}
  on:focus={() => (isFocused = true)}
  on:blur={() => (isFocused = false)}
  bind:this={hostRef}
  tabindex="0">
  {#if title}
    <div class="title">{title}</div>
  {/if}

  <svg class="svg">
    <path class="emptyOutline" d={describeArc(0, 0, 15, degStart, degFull)} />
    <path class="filledOutline" d={describeArc(0, 0, 15, degStart, degEndOutline)} />
    <path
      class="triangle"
      d="M -14.14,-14.14 L -14.14,-19.2 -19.2,-14.14 -14.14,-14.14 Z M -14.14,-14.14"
      transform={`translate(24, 24) rotate(${degTriangle})`} />
    <path
      class="needle"
      stroke-miterlimit="10"
      d="M 0,0 L 0,19"
      transform={`translate(24, 24) rotate(${needleRotation})`} />
    <circle class="centerDot" cx="24" cy="24" r="3" />
  </svg>

  <div class="value dialinput">
    <NumInput
      on:change={onInputChange}
      isFocused={isInputFocused}
      {value}
      {unitStyle}
      extraClasses="dialinput" />
  </div>
</div>
