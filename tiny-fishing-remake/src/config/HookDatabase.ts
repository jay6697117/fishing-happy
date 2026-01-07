import hooksData from '@/data/hooks.json';

export interface HookData {
  id: number;
  spriteId: number;
  spriteName: string;
  price: number;
  xCatch: number;
  yCatch: number;
  sizeY: number;
  hookObject: number;
}

const HOOK_DATABASE = hooksData as HookData[];

export function getHookById(id: number): HookData | undefined {
  return HOOK_DATABASE.find((hook) => hook.id === id);
}

export function getAllHooks(): HookData[] {
  return HOOK_DATABASE;
}
