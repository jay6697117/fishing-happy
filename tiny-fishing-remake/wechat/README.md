# 微信小游戏调试指南

本文档描述微信小游戏构建与真机调试流程。

## 构建

1. 设置广告激励视频的 Ad Unit ID（可选但推荐）。
2. 执行构建命令生成 `dist-wechat`。

```bash
export VITE_WECHAT_REWARD_AD_UNIT_ID="YOUR_AD_UNIT_ID"
npm run build:wechat
```

## 导入到微信开发者工具

1. 打开微信开发者工具。
2. 选择“小游戏”项目类型，导入 `dist-wechat` 目录。
3. 如果需要真机调试，请在 `dist-wechat/project.config.json` 中替换真实 `appid`。

## 真机调试

1. 在开发者工具中点击“真机调试”。
2. 扫码并在手机上运行。
3. 如需调试广告回调，确保后台已配置对应广告位，并且 `VITE_WECHAT_REWARD_AD_UNIT_ID` 与后台一致。

## 常见问题

- 如果 `main.js` 未加载，请确认 `dist-wechat/game.js` 中引用路径正确。
- 若广告不可用，请检查 `appid`、广告位状态以及网络环境。
