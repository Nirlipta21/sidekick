import Store from 'electron-store';
import type { BrowserWindow } from 'electron';

type State = { x?: number; y?: number; width?: number; height?: number };

const store = new Store() as any;

export function createWindowStateStore(key: string) {
  const state = (store.get(key) ?? {}) as State;
  return {
    ...state,
    save(win: BrowserWindow) {
      const bounds = win.getBounds();
      store.set(key, bounds);
    }
  };
}
