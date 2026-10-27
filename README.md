# Rectfly 官网

https://ann61c.github.io/rectfly-site/ ，由 GitHub Pages 从 `main` 发布。

纯 HTML + CSS，无框架、JavaScript、构建步骤或第三方请求。适配手机与系统深色模式。

## 页面

| 页面 | 要点 |
| --- | --- |
| `index.html` | iOS 双拼键盘、整句纠错、离线输入、Rime 用户词导入、四种双拼、中英混打；TestFlight 公开测试入口 |
| `privacy.html` | 中英隐私政策：日志默认关闭、本机学习、完全访问、主 App 语法联网、用户确认后直接上传评测统计、失败重试与取消 |
| `support.html` | 添加键盘、完全访问、Rime 导入、方案与英文切换、语法下载、问题反馈 |
| `attributions.html` | 来源、作者、许可、修改说明；完整 App 署名原文与本地许可全文 |
| `assets/screenshots/` | 公开版模拟器截图与录屏，说明见该目录 README |

联系邮箱：rectfly@fastmail.com。首页键盘为自行编写的排版示意，并非 App 截图。

## 预览与检查

```sh
python3 check_site.py
python3 -m http.server 8123 --bind 127.0.0.1
```

## 与 App 保持一致

- 隐私政策描述公开版行为。App 改动日志默认值、评测分享方式、联网或完全访问用途时，同步改 `privacy.html`。
- `ATTRIBUTIONS.md` 从 App 原样复制，完整内容也内嵌于致谢页；`assets/licenses/` 来自 App 的 Data 目录（Emoji 许可改名 `Emoji-LICENSE.txt`，字符补充许可改名 `Character-Wanxiang-LICENSE.txt`，内容不变）。App 数据源或许可变化时同步。
- 万象语法备用下载与数据公开副本发布在本仓库 Release `data-wanxiang-20260909`。
