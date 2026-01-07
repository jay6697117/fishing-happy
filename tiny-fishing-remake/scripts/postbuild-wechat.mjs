import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'dist-wechat');
const wechatDir = path.join(projectRoot, 'wechat');

const filesToCopy = ['game.js', 'game.json', 'project.config.json', 'weapp-adapter.js'];

if (!fs.existsSync(distDir)) {
  throw new Error(`dist-wechat not found: ${distDir}`);
}

filesToCopy.forEach((file) => {
  const src = path.join(wechatDir, file);
  const dest = path.join(distDir, file);
  fs.copyFileSync(src, dest);
});
