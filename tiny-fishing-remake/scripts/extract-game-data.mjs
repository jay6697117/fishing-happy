import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourcePath = path.resolve(projectRoot, '../TinyFishing/html5game/TinyFishing.js');
const outputDir = path.resolve(projectRoot, 'src/data');

function readSource() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }
  return fs.readFileSync(sourcePath, 'utf8');
}

function findArrayAfterKey(content, key) {
  const keyIndex = content.indexOf(key);
  if (keyIndex === -1) {
    throw new Error(`Key not found: ${key}`);
  }
  const start = content.indexOf('[', keyIndex);
  if (start === -1) {
    throw new Error(`Array start not found for key: ${key}`);
  }
  let depth = 0;
  for (let i = start; i < content.length; i += 1) {
    const ch = content[i];
    if (ch === '[') depth += 1;
    if (ch === ']') depth -= 1;
    if (depth === 0) {
      return content.slice(start, i + 1);
    }
  }
  throw new Error(`Array end not found for key: ${key}`);
}

function findArrayBeforeMarker(content, marker) {
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }
  const closeIndex = content.lastIndexOf(']', markerIndex);
  if (closeIndex === -1) {
    throw new Error(`Array end not found before marker: ${marker}`);
  }
  let depth = 0;
  for (let i = closeIndex; i >= 0; i -= 1) {
    const ch = content[i];
    if (ch === ']') depth += 1;
    if (ch === '[') depth -= 1;
    if (depth === 0) {
      return content.slice(i, closeIndex + 1);
    }
  }
  throw new Error(`Array start not found before marker: ${marker}`);
}

function parseSpriteList(content) {
  const spriteArrayText = findArrayAfterKey(content, '_i2:');
  const raw = spriteArrayText.slice(1, -1);
  const blocks = raw.split(/},\s*{/).map((block) => `{${block}}`);

  return blocks.map((block, index) => {
    const nameMatch = block.match(/_92:\s*"([^"]+)"/);
    const framesMatch = block.match(/_s2:\s*\[([^\]]*)\]/);
    const frames = framesMatch
      ? framesMatch[1]
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isFinite(value))
      : [];

    return {
      id: index,
      name: nameMatch ? nameMatch[1] : `sprite_${index}`,
      frames
    };
  });
}

function parseTextureEntries(content) {
  const entriesText = findArrayBeforeMarker(content, '_Km:');
  const entryMatches = [...entriesText.matchAll(/{[^}]*?_Jm:\s*([0-9]+)[^}]*?}/gs)];
  return entryMatches.map((match) => {
    const chunk = match[0];
    const getNumber = (key) => {
      const regex = new RegExp(`${key}:\\s*([0-9.]+)`);
      const m = chunk.match(regex);
      return m ? Number(m[1]) : 0;
    };
    return {
      x: getNumber('x'),
      y: getNumber('y'),
      width: getNumber('_oa'),
      height: getNumber('_pa'),
      sourceX: getNumber('_Dm'),
      sourceY: getNumber('_Em'),
      frameWidth: getNumber('_Fm'),
      frameHeight: getNumber('_Gm'),
      sourceWidth: getNumber('_Hm'),
      sourceHeight: getNumber('_Im'),
      page: getNumber('_Jm')
    };
  });
}

function parseTexturePages(content) {
  const pagesArrayText = findArrayAfterKey(content, '_Km:');
  return [...pagesArrayText.matchAll(/"([^"]+\.png)"/g)].map((m) => m[1]);
}

function parseFishData(content, spriteNameMap) {
  const fishMatches = [...content.matchAll(/_68\(\s*_yn\s*,\s*_zn\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)/g)];
  return fishMatches.map((match, index) => {
    const spriteId = Number(match[1]);
    return {
      id: index + 1,
      spriteId,
      spriteName: spriteNameMap[spriteId] ?? 'unknown',
      price: Number(match[2]),
      minDepth: Number(match[3]),
      maxDepth: Number(match[4]),
      rarityWeight: Number(match[5]),
      type: Number(match[6]),
      scale: Number(match[7]),
      animType: Number(match[8])
    };
  });
}

function parseHookData(content, spriteNameMap) {
  const hookMatches = [...content.matchAll(/_98\(\s*_yn\s*,\s*_zn\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)/g)];
  return hookMatches.map((match, index) => {
    const spriteId = Number(match[1]);
    return {
      id: index + 1,
      spriteId,
      spriteName: spriteNameMap[spriteId] ?? 'unknown',
      price: Number(match[2]),
      xCatch: Number(match[3]),
      yCatch: Number(match[4]),
      sizeY: Number(match[5]),
      hookObject: Number(match[6])
    };
  });
}

function writeJson(name, data) {
  const outPath = path.join(outputDir, name);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
}

function main() {
  const content = readSource();
  const spriteList = parseSpriteList(content);
  const spriteNameMap = Object.fromEntries(spriteList.map((item) => [item.id, item.name]));

  const fishData = parseFishData(content, spriteNameMap);
  const hookData = parseHookData(content, spriteNameMap);
  const textureEntries = parseTextureEntries(content);
  const texturePages = parseTexturePages(content);

  writeJson('sprites.json', spriteList);
  writeJson('fish.json', fishData);
  writeJson('hooks.json', hookData);
  writeJson('texture-entries.json', textureEntries);
  writeJson('texture-pages.json', texturePages);
}

main();
