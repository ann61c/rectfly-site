# Rectfly 官网（本地待审）

纯 HTML + CSS，无框架、JavaScript、构建步骤或第三方请求。适配手机与系统深色模式。

## 页面清单

| 页面 | 要点 |
| --- | --- |
| `index.html` | iOS 双拼键盘、整句纠错、离线输入、Rime 用户词导入、四种双拼、中英混打；`#testflight` 预留测试入口 |
| `privacy.html` | 中英隐私草案：日志默认关闭、本机学习、完全访问、主 App 语法联网、用户同意后系统分享评测统计 |
| `support.html` | 添加键盘、完全访问、Rime 导入、方案与英文切换、语法下载、问题反馈 |
| `attributions.html` | 来源、作者、许可、修改说明；完整 App 署名原文与本地许可全文 |

联系邮箱：rectfly@fastmail.com（已确认，全站使用 `mailto:`）。首页键盘为自行编写的排版示意，明确标注，并非 App 截图。不包含用户输入、私人词库或私人截图。

## 本地预览与检查

```sh
python3 check_site.py
python3 -m http.server 8123 --bind 127.0.0.1
```

浏览器打开 http://127.0.0.1:8123/ 。文件均使用相对路径，可部署在未来的 `/rectfly-site/` 子路径，无需改资源路径。当前不包含远程仓库、推送或发布配置。

## 发布前必须核对的差异

事实基线：`/Users/zx/workplace/rectfly`，2026-10-22 读取时 HEAD 为 `d9c5b20a0741c0d85c8d4ad306b42b5edd7bd155`。只读取代码、文档、公开许可与 App 图标；不修改 App。未安装或运行公开二进制。

1. **日志当前默认开启。** `RectflyShared/RectflyKeyboardSettings.swift:92` 在键不存在时返回 true，`Rectfly/ContentView.swift:26` 的状态初值也是 true。按 brief 要求，官网政策写公开版默认关闭，且明确标为待生效草案。发布前须改 App 默认值，并验证新安装、升级后的既有偏好与关闭/删除操作；仅发布本站不能实现这一行为。
2. **联邦分享尚非系统分享。** `Rectfly/FederatedEvaluation.swift` 的 `FederatedResultSheet.share()` 仅保存 `.shared` 同意状态，并提示“上传功能上线后会自动发送这次结果”，没有系统分享导出。本站按 brief 写“同意后系统分享、无自动上传、无接收服务器”。发布前须让 App 符合此约定，处理已有同意状态，移除未来自动发送提示，并验证拒绝分享不会导出。统计包含计数、输入长度分桶、实验/构建标识及完成日期，不应把它简化成只有四个数字。评测本身当前默认开启，网站没有声称其默认关闭。
3. **完全访问确实请求。** `RectflyKeyboard/Info.plist` 的 `RequestsOpenAccess=true`。README、共享存储代码及设置说明用途为本机 App/键盘间设置、震动、用户词库、语法模型、学习及诊断数据共享。网站说明权限会同时赋予网络能力，但键盘不发送输入。基础输入无权限的实际体验、各项共享功能在新安装/撤销权限后的表现须由公开版真机确认。
4. **“完全离线”仅适用于键盘输入。** `Rectfly/GrammarDownload.swift` 初始化后调用 `checkForUpdate()`，通过 GitHub API 查询更新，用户选择后下载；`Shared/GrammarStore.swift` 定义上游和固定回退地址。网站已明确披露，未宣称整个主 App 永不联网。需确认公开版是否保留启动检查及其最终下载源；README 指固定回退源仍需公开可下载。
5. **署名不等于完成数据发布。** App `ATTRIBUTIONS.md` 要求另行发布公开、无需认证的 `wanxiang-used-e5cb7db.tar.gz` 数据附件；其状态未核验，本任务不创建远程或发布附件。网站保留完整署名及许可，但不复制词库、模型或私人层。
6. **测试入口与兼容性。** TestFlight 链接仍为 `#testflight`，页面明确“待开放”；正式开放前替换入口。iOS 26 来自 `project.pbxproj` 的 deployment target，须与最终测试构建设备要求一致。未使用准确率、速度或用户数等宣传数字。

## 署名同步

`ATTRIBUTIONS.md` 从 App 原样复制，完整内容也作为转义文本内嵌于致谢页。`assets/licenses/` 的许可来自 App 的 Data 目录；Emoji 许可为避免文件名冲突重命名为 `Emoji-LICENSE.txt`，字符补充许可重命名为 `Character-Wanxiang-LICENSE.txt`，内容不变。App 数据源或许可证变化时需同步核对。

## 本次验证

- `python3 check_site.py`：四页的本地链接/锚点、单一主标题与正文地标、当前导航、语言、viewport、图片替代文本、邮箱、相对路径、无脚本/远程嵌入检查通过。
- 浏览器：四页 × 320 / 390 / 1280 CSS 像素 × 浅色/深色，共 24 种组合，无横向溢出、图片加载失败或外部资源请求；目视检查桌面首页、手机首页与手机深色隐私页。
- 完整署名原文件、页面中的转义原文与七份许可文件均与 App 源文件比对通过；未修改许可文字。
- 未运行 App 真机或公开构建验证，未核验外部来源链接可达性、语法回退源及数据附件的公开发布状态。

仅完成本地制作与 commit。经负责人和用户审阅后，另行决定发布。
