import { onDestroy } from 'svelte';
import throttle from 'raf-throttle';

export function useMouseEventsBlocker(val) {
  document.body.style['pointer-events'] = val ? 'none' : 'auto';
  // document.body.style['user-select'] = val ? 'none' : 'auto';
}

export function useGlobalMouseMove(callback) {
  const throttledCallback = throttle(callback);
  let localIsActive;

  onDestroy(() => {
    if (localIsActive) {
      // console.log('cleaning useGlobalMouseUp');
      window.removeEventListener('mousemove', callback);
    }
  });

  return function globalMouseMove(isActive) {
    if (isActive) {
      window.addEventListener('mousemove', callback);
    } else {
      window.removeEventListener('mousemove', callback);
    }

    localIsActive = isActive;
  };
}

export function useGlobalMouseUp(callback) {
  let localIsActive;

  onDestroy(() => {
    if (localIsActive) {
      // console.log('cleaning useGlobalMouseUp');
      window.removeEventListener('mouseup', callback);
    }
  });

  return function globalMouseUp(isActive) {
    if (isActive) {
      window.addEventListener('mouseup', callback);
    } else {
      window.removeEventListener('mouseup', callback);
    }

    localIsActive = isActive;
  };
}
