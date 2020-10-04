import { writable } from 'svelte/store';

export function createStore() {
  const { subscribe, update } = writable({
    inouts: [
      { name: 'a0', x: 20, y: 20 },
      { name: 'a1', x: 180, y: 20 },
      { name: 'a2', x: 100, y: 120 },
      //
      { name: 'a3', x: 20, y: 180 },
      { name: 'a4', x: 180, y: 180 },
      //
      { name: 'a5', x: 80, y: 260 },
      { name: 'a6', x: 240, y: 290 },
    ],
    lines: [
      { name: 'l0', from: 'a0', to: 'a1' },
      { name: 'l1', from: 'a0', to: 'a2' },
      { name: 'l2', from: 'a1', to: 'a2' },
      { name: 'l3', from: 'a3', to: 'a4' },
      { name: 'l4', from: 'a5', to: 'a6' },
    ],
  });

  return { subscribe };
}

export const store = createStore();
