# Rectfly 官网

https://rectfly.app ，托管在 Cloudflare Workers 静态资源，用 wrangler 手动部署。旧副本 https://ann61c.github.io/rectfly-site/ 仍由 GitHub Pages 从 `main` 发布。

纯 HTML + CSS + 本站脚本和字体（`assets/fonts/`），无框架、构建步骤或第三方请求。适配手机与系统深色模式。

## 页面

| 页面 | 要点 |
| --- | --- |
| `index.html` | iOS 双拼键盘、整句纠错、离线输入、Rime 用户词导入、四种双拼、中英混打；TestFlight 公开测试入口 |
| `privacy.html` | 中英隐私政策：日志默认关闭、本机学习、完全访问、主 App 语法联网、用户确认后直接上传评测统计、失败重试与取消 |
| `support.html` | 添加键盘、完全访问、Rime 导入、方案与英文切换、语法下载、问题反馈 |
| `attributions.html` | 来源、作者、许可与本地许可全文；不写数据处理方法 |
| `assets/screenshots/` | 公开版模拟器截图与录屏，说明见该目录 README |

联系邮箱：rectfly@fastmail.com。首页键盘为自行编写的排版示意，并非 App 截图。

## 预览与检查

```sh
python3 check_site.py
python3 -m http.server 8123 --bind 127.0.0.1
```

## 与 App 保持一致

- 隐私政策描述公开版行为。App 改动日志默认值、评测分享方式、联网或完全访问用途时，同步改 `privacy.html`。
- `assets/licenses/` 保留上游许可原文，只附名称、作者、来源、许可和「Modified.」标记，不写数据处理方法。App 数据源或许可变化时同步。
- 万象语法备用下载与数据公开副本发布在本仓库 Release `data-wanxiang-20260909`。
