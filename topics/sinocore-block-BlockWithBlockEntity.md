# 带有 BlockEntity 的 Block

对于带有 `BlockEntity` 的 `Block`，`SinoCore` 提供 `AbstractEntityBlock` 类作为 `Block` 的基类。

`AbstractEntityBlock` 是一个抽象类，要求一个 `BlockEntity` 类型的泛型，直接继承自 `BaseEntityBlock`。程序运行时，
通过反射获取到该泛型的具体类型以识别所需 `BlockEntity` 类型。与原版 `BaseEntityBlock` 相比，该类有以下特性：

- 实现了 `newBlockEntity` 方法，默认通过 `BlockEntityType` 创建 `BlockEntity` 对象
- 重写了 `getTicker` 方法。只需要在该类对应的 `BlockEntity` 上实现 `BlockEntityTicker` 接口即可实现 `BlockEntity` 每 tick 执行任务
- 重写了 `getListener` 方法。只需要在该类对应的 `BlockEntity` 上实现 `GameEventListener` 接口即可实现对原版游戏事件的监听
- 重写了 `use` 方法，只需要在该类对应的 `BlockEntity` 上实现 `MenuProvider` 接口即可实现右键方块打开对应的 GUI
- 重写了 `getRenderShape` 方法，默认 `RenderShape.MODEL`，使之直接使用方块材质而非 `TER`
