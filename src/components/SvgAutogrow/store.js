import { writable } from 'svelte/store';
import { NS } from './names';

function generateUuid(prefix) {
  return prefix + ~~(Math.random() * 1e9);
}

export function createStore() {
  const { subscribe, update } = writable({
    [NS.BOXES]: {
      baba: {
        name: 'baba',
        x: 20,
        y: 20,
      },
      momo: {
        name: 'momo',
        x: 100,
        y: 100,
      },
    },
  });

  return {
    subscribe,
    //
    addBox(x, y) {
      update((state) => {
        const name = generateUuid('box');
        return {
          ...state,
          [NS.BOXES]: {
            ...state[NS.BOXES],
            [name]: { name, x, y },
          },
        };
      });
    },
    //
    removeBox(name) {
      update((state) => {
        const { [name]: _, ...boxes } = state[NS.BOXES];
        return { ...state, [NS.BOXES]: boxes };
      });
    },
    //
    setPosition(name, x, y) {
      update((state) => {
        return {
          ...state,
          [NS.BOXES]: {
            ...state[NS.BOXES],
            [name]: {
              ...state[NS.BOXES][name],
              x,
              y,
            },
          },
        };
      });
    },
    setPositionDelta(name, dx, dy) {
      update((state) => {
        return {
          ...state,
          [NS.BOXES]: {
            ...state[NS.BOXES],
            [name]: {
              ...state[NS.BOXES][name],
              x: state[NS.BOXES][name].x + dx,
              y: state[NS.BOXES][name].y + dy,
            },
          },
        };
      });
    },
  };
}

export const store = createStore();
