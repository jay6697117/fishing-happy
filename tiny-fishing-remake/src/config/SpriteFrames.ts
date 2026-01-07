import spriteFrames from '@/data/sprite-frames.json';

const frameMap = spriteFrames as Record<string, string[]>;

export function getFrames(spriteName: string): string[] {
  return frameMap[spriteName] ?? [];
}

export function getFirstFrame(spriteName: string): string {
  const frames = getFrames(spriteName);
  return frames[0] ?? spriteName;
}
