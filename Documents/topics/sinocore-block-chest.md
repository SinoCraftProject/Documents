# 箱子

箱子类是实现树时的一种副产物，早期伴随树而注册，后来转为独立实现和注册。
每个箱子都有对应的 `BlockEntity`，方块对应的 `BlockEntity` 可直接通过构造函数创建。

| 箱子类型 |         Block 类         |          BlockEntity 类          |
|:----:|:-----------------------:|:-------------------------------:|
| 普通箱子 |    `ChestBlockBase`     |    `SimpleChestBlockEntity`     |
| 陷阱箱  | `TrappedChestBlockBase` | `SimpleTrappedChestBlockEntity` |

`ChestBlockBase#verifyTexture` 可用于校验箱子纹理是否存在。如果不存在则会在 log 中输出缺失的纹理。一般在注册 `DataProvider` 
的事件中调用该函数。

## 物品

箱子方块对应的物品使用 `BaseChestItem` 创建。该类是一个抽象类，继承自 `BlockItem`，可以通过 `create` 工厂方法创建，
或实现 `getBlockEntityType` 方法返回对应方块的 `BlockEntityType` 实例。

`BaseChestItem` 实现了用于箱子的发射器行为和物品渲染，并允许通过配方的形式设置燃烧时间。

## 渲染

与箱子方块配套的，还包括一系列客户端使用的渲染类：

- 用于 BlockEntity 方块渲染的 `BaseChestRenderer` 类，使用时直接在 `EntityRenderersEvent.RegisterRenderers` 事件中注册即可。

  该类继承自 `ChestRenderer`，在构造函数中还需要传入额外参数以确定实体纹理所在位置：

  ```Java
  public BaseChestRenderer(BlockEntityRendererProvider.Context context, ResourceLocation name, boolean isTrapped) {
      // ...
  }
  ```

  `ResourceLocation name` 决定了箱子纹理名称的主要部分，`boolean isTrapped` 决定是否添加 `trapped_` 前缀，表示陷阱箱。

  箱子纹理保存于 `assets/${name.namespace}/textures/entity/chest` 中，普通箱子需要以下几种材质：

    - `${name.path}.png`
    - `${name.path}_left.png`
    - `${name.path}_right.png`

  陷阱箱需要以下几种材质：

    - `trapped_${name.path}.png`
    - `trapped_${name.path}_left.png`
    - `trapped_${name.path}_right.png`

  不带有后缀的纹理表示单一箱子的纹理，带有 `_left` 后缀表示大箱子左半面的纹理，带有 `_right` 后缀表示大箱子右半面的纹理。

- 用于物品渲染的 `BaseChestItemRenderer` 类。该类在 `BaseChestItem#initializeClient` 中自动创建，无需手动注册或创建。

## 注册与使用流程

1. 通过 `DeferredRegister` 注册用于箱子的 `Block`, `BlockEntity` 和 `Item`
2. 监听 `EntityRenderersEvent.RegisterRenderers` 事件（bus=MOD, value=CLIENT），
使用 `RegisterRenderers#registerBlockEntityRenderer` 方法注册用于方块渲染的 `BaseChestRenderer`
3. 添加 DataProvider 并执行 `runData`，根据 log 提示补全丢失的纹理
   - 通过 `AbstractBlockTagsProvider#chest` 添加默认方块 Tag，`AbstractItemTagsProvider#chest` 添加默认物品 Tag
   - 通过 `AbstructLootTableProvider#addBlock` 添加掉落物表
   - 通过 `AbstractAutoBlockStateProvider#chest` 添加方块模型支持
   - 通过 `AbstractItemTagsProvider#chest` 添加物品模型支持
   - 通过 `AbstractRecipeProvider#chest` 添加物品配方
   - 添加对应语言 Provider
