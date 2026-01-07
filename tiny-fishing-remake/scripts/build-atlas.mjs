import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const dataDir = path.join(projectRoot, 'src/data');
const publicDir = path.join(projectRoot, 'public');
const texturesDir = path.join(publicDir, 'assets/textures');
const atlasDir = path.join(publicDir, 'assets/atlas');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error(`Not a PNG file: ${filePath}`);
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function buildAtlas() {
  const sprites = readJson(path.join(dataDir, 'sprites.json'));
  const entries = readJson(path.join(dataDir, 'texture-entries.json'));
  const pages = readJson(path.join(dataDir, 'texture-pages.json'));

  const spriteFrames = {};
  const framesByPage = pages.map(() => []);

  sprites.forEach((sprite) => {
    const frameNames = [];
    sprite.frames.forEach((frameIndex, orderIndex) => {
      const entry = entries[frameIndex];
      if (!entry) return;
      const frameName = `${sprite.name}__${orderIndex}`;
      frameNames.push(frameName);

      const trimmed =
        entry.sourceX > 0 ||
        entry.sourceY > 0 ||
        entry.sourceWidth > entry.frameWidth ||
        entry.sourceHeight > entry.frameHeight;

      const frame = {
        filename: frameName,
        frame: {
          x: entry.x,
          y: entry.y,
          w: entry.width,
          h: entry.height
        },
        rotated: false,
        trimmed,
        spriteSourceSize: {
          x: entry.sourceX,
          y: entry.sourceY,
          w: entry.frameWidth,
          h: entry.frameHeight
        },
        sourceSize: {
          w: entry.sourceWidth,
          h: entry.sourceHeight
        }
      };

      framesByPage[entry.page]?.push(frame);
    });

    spriteFrames[sprite.name] = frameNames;
  });

  const textures = pages.map((pageName, pageIndex) => {
    const pagePath = path.join(texturesDir, pageName);
    const size = readPngSize(pagePath);
    return {
      image: `../textures/${pageName}`,
      format: 'RGBA8888',
      size: {
        w: size.width,
        h: size.height
      },
      scale: '1',
      frames: framesByPage[pageIndex] || []
    };
  });

  const atlas = {
    textures,
    meta: {
      app: 'tiny-fishing-remake',
      version: '1.0',
      scale: '1'
    }
  };

  fs.mkdirSync(atlasDir, { recursive: true });
  fs.writeFileSync(path.join(atlasDir, 'tiny-fishing.json'), JSON.stringify(atlas, null, 2));
  fs.writeFileSync(path.join(dataDir, 'sprite-frames.json'), JSON.stringify(spriteFrames, null, 2));
}

buildAtlas();
