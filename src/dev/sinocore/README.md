# 华夏核心

文档对应核心版本：1.2.0

这是华夏系列模组的通用代码库，但设计上也适合其他模组开发者使用。  


## 主要特性

- 让模组加载器的差异对主要功能代码透明
  - 游戏对象注册注册API
  - 网络API
  - 事件系统
- 保持API相对稳定，便于跨游戏版本升级
- GUI
  - 使用Json描述GUI布局，支持热重载
  - 提供了易于扩展组件化GUI系统
    - 已在NBTEdit中经历过实践检验
- 模拟了在旧的MC版本中存在的一些较为便捷的设计
  - 提供了类似于1.19.2以前把物品添加到创造模式物品栏的方法
- 在NeoForge下提供了用于增强DataGen功能的API
  - 根据注册表自动生成物品模型、方块状态
  - 自动在不同的`LanguageProvider`提供的翻译键之间比较差异
  - 提供了更宽松的`ModelFile.ExistingModelFile`实现，输出警告而非直接抛出异常

## 使用许可
本项目采用PolyForm Shield License 1.0.0，详情请参阅[LICENSE](https://github.com/SinoCraftProject/SinoCore/blob/main/LICENSE)文件。

## 相关链接
GitHub仓库：https://github.com/SinoCraftProject/SinoCore  
Wiki：https://docs.sino.moegirl.games/dev/sinocore/  
CurseForge页面：https://www.curseforge.com/minecraft/mc-mods/sinocore  
Modrinth页面：https://modrinth.com/mod/sinocore  
MC百科页面：https://www.mcmod.cn/class/15622.html
