# LocalMCPManus - MCP桌面工具集

<br />
<p align="center">
    <img src="resources/build/icon.svg" width="64" />
</p>

一个现代化的使用各种MCP工具集，基于 Electron + React + TypeScript + TailwindCSS 开发。该项目提供了一个强大的跨平台桌面应用程序，用于管理和使用任务。
开发中...


### 目录结构：
app   #包含渲染进程的文件和组件。
├── App.tsx
├── assets
│   └── logo.svg
├── components
│   ├── Header.jsx  #菜单栏组件。
│   ├── NewToolButton.jsx  #新建工具按钮组件。
│   ├── ResultsPanel.jsx    # 运行结果面板
│   ├── SearchTools.jsx     # 搜索工具组件
│   ├── SettingsPanel.jsx  # 工具设置页面
│   ├── Sidebar.jsx        #侧边栏
│   └── ToolCard.jsx      # 工具卡片
├── index.d.ts
├── index.html
├── renderer.tsx  #入口，调用App.tsx进入主界面
├── styles
│   ├── app.css
│   └── tailwind.css
└── window
    ├── components
    │   ├── Titlebar.tsx
    │   ├── TitlebarContext.tsx
    │   └── WindowContext.tsx
    ├── index.ts
    ├── ipcEvents.ts
    ├── titlebarMenus.ts
    └── window.css
lib
├── main
│   ├── app.ts
│   ├── index.d.ts
│   └── main.ts
└── preload
    ├── api.ts
    ├── index.d.ts
    └── preload.ts



LocalMCPManus是一个基于Electron的桌面工具集，界面采用卡片式设计，分为左侧工具卡片区和右侧编辑与结果区。应用程序主要功能包括：

### 菜单栏：
包括Logo、设置（语言，主题），帮助图标和GitHub链接

### 左侧工具区：
工具搜索功能
下面有1个新建工具按钮：
MCP工具卡片展示（包含展示MCP工具卡片，卡片包含图标，标题，描述，tags，设置，运行，克隆)
卡片操作按钮（设置、运行、克隆）


### 右侧编辑与结果区：
设置详细菜单（可编辑标题、描述、标签等）
模型设置（选择使用哪家模型提供商）
MCP配置（浏览MCP商店，一键配置）
本地数据目录设置
运行结果展示

<br />

## 主要功能

- 🎯 卡片式界面设计
  - 左侧任务卡片区：展示任务卡片列表
  - 右侧编辑与结果区：显示设置菜单和运行结果
- 🧩 任务卡片功能
  - 精美图标展示
  - 标题和描述信息
  - 标签分类系统
  - 设置、运行、克隆按钮
- ⚙️ 设置菜单
  - 标题和描述编辑
  - 标签管理
  - 模型提供商选择（支持多家 AI 模型）
  - MCP 配置（一键配置）
  - 本地数据目录设置
  - 导出分享本卡片为json格式，方便导出
  - 导入卡片
- 🏪 MCP 商店集成
  - 浏览和安装 MCP 工具
  - 工具版本管理
- 🔍 工具搜索功能
  - 快速定位所需工具
  - 按标签筛选
- 📝 结果管理
  - 结果预览和编辑
  - 历史记录查看
- 🌓 界面定制
  - 深色/浅色主题
  - 多语言支持
- 💾 数据持久化
  - 本地存储配置和结果

<br />

## 界面布局

- 📊 菜单栏
  - Logo 展示
  - 设置图标
  - 帮助图标
  - GitHub 链接
- 📋 左侧工具区
  - 搜索工具栏
  - MCP 工具卡片列表（含图标、标题、描述、标签等）
  - 卡片交互按钮（设置、运行、克隆）
- 📝 右侧编辑与结果区
  - 设置详细菜单（标题、描述、标签、模型设置等）
  - MCP 配置选项
  - 本地数据目录设置
  - 运行结果展示

<br />

## 技术栈

- ⚡ Electron - 跨平台桌面应用框架
- ⚛️ React - 组件化 UI 库
- 📦 TypeScript - 类型安全的 JavaScript
- 🎨 TailwindCSS - 实用优先的 CSS 框架
- 🚀 Vite - 极速的构建工具

<br />

## 系统要求

- Node.js (v18 或更高版本)
- npm, yarn, pnpm 或 bun

<br />

## 安装

克隆仓库并安装依赖：

```bash
# 克隆仓库
git clone https://github.com/yourusername/LocalMCPManus
cd LocalMCPManus

# 安装依赖
npm install
# 或
yarn
# 或
pnpm install
# 或
bun install
```

<br />

## 开发

启动开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun run dev
```

这将启动带有热重载功能的 Electron 应用。

<br />

## 项目结构

```markdown
├── app/                        # 渲染进程文件
│   ├── assets/                 # 静态资源
│   ├── components/             # React 组件
│   │   ├── Header/             # 菜单栏组件
│   │   ├── ToolCard/           # 工具卡片组件
│   │   ├── SearchBar/          # 搜索栏组件
│   │   ├── SettingsPanel/      # 设置面板组件
│   │   ├── ResultPanel/        # 结果面板组件
│   │   └── Store/              # MCP 商店组件
│   ├── contexts/               # React 上下文
│   ├── hooks/                  # 自定义 hooks
│   ├── styles/                 # CSS 和 Tailwind 文件
│   └── renderer.tsx            # 渲染进程入口
├── lib/                        # 共享库代码
│   ├── main/                   # 主进程代码
│   ├── store/                  # 本地商店实现
│   ├── database/               # 数据库操作
│   ├── i18n/                   # 国际化支持
│   ├── models/                 # 模型提供商接口
│   └── window/                 # 窗口实现
├── resources/                  # 构建资源
│   ├── icons/                  # 应用图标
│   └── themes/                 # 主题资源
└── ...                        # 其他配置文件
```

<br />

## 开发计划

本项目分为以下阶段：

### 第一阶段：环境搭建与基础框架（1-2天）
- 📍 项目初始化
  - 使用Electron Forge或Vite-Electron-Builder设置项目基础
  - 配置TypeScript、ESLint、Prettier和Husky
  - 设置TailwindCSS和基础主题
- 📍 搭建项目骨架
  - 实现主进程与渲染进程通信
  - 创建基础窗口管理系统
  - 配置i18n国际化支持

### 第二阶段：核心UI组件开发（2-3天）
- 📍 设计与实现布局系统
  - 创建基础布局组件
  - 实现响应式设计
- 📍 开发UI组件
  - 实现菜单栏组件（Header）
  - 开发搜索栏组件（SearchBar）
  - 构建工具卡片组件（ToolCard）
  - 创建设置面板组件（SettingsPanel）
  - 实现结果面板组件（ResultPanel）
- 📍 状态管理实现
  - 创建全局上下文（Context）
  - 实现主题切换功能
  - 开发语言切换功能

### 第三阶段：功能实现（3-4天）
- 📍 MCP工具管理系统
  - 实现工具卡片的CRUD操作
  - 创建标签管理系统
  - 开发卡片搜索与筛选功能
- 📍 MCP商店功能
  - 实现商店浏览界面
  - 开发工具安装与更新功能
  - 创建版本管理系统
- 📍 设置系统
  - 实现应用设置存储与读取
  - 开发模型提供商配置功能
  - 创建本地数据目录设置功能
- 📍 结果管理
  - 实现结果预览与编辑
  - 开发历史记录查看功能

### 第四阶段：完善与测试（2-3天）
- 📍 性能优化
  - 优化大量卡片渲染性能
  - 实现惰性加载
  - 优化数据库访问
- 📍 测试
  - 编写单元测试
  - 实现集成测试
  - 进行用户体验测试
- 📍 文档
  - 完善用户文档
  - 编写开发者文档
  - 创建API文档

### 第五阶段：打包与发布（1天）
- 📍 构建系统
  - 配置多平台构建（Windows、macOS、Linux）
  - 实现自动更新功能
  - 开发安装程序
- 📍 发布准备
  - 进行最终测试
  - 准备发布说明
  - 创建宣传材料

<br />

## 贡献

欢迎提交 Pull Request 来改进这个项目！

<br />

## 许可证

MIT
