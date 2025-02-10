# 注册表

华夏核心提供了一个加载器无关的注册表系统。

## 使用方法
通过 `RegistryManager#create(String modId, ResourceKey<Registry<T>> key)` 方法获取 SinoCore 注册表（`IRegistry`）。  
使用 `IRegistry#register(String name, Supplier<? extends R> supplier)` 进行注册。

### 一些提供额外方法的注册表
- Tab 注册表 `ITabRegistry`
  - `RegistryManager#createTab(String modId)` 
  - 提供了 `ITabRegistry#registerForRef(String name)` 便于获取 `IRegRef<CreativeModeTab>`。
- Menu 注册表 `IMenuRegistry`
  - `RegistryManager#createMenu(String modId)`
  - 提供了 `IMenuRegistry#register(String name, MenuFactory<T> factory)` 以解决私有的 `MenuSupplier` 带来的不便。
- Screen 注册表 `IScreenRegistry`
  - `RegistryManager#createScreen(String modId)`
  - 提供了和 `IMenuRegistry` 对应的 `IScreenRegistry#register(IRegRef<MenuType<?>> menuType, IScreenFactory<T> screenFactory)`。
- Command 注册表 `ICommandRegistry`
  - `RegistryManager#createMenu(String modId)`
  - 提供了 `ICommandRegistry#registerCommand(Command command)` 来注册 `Command`。
- DataProvider 注册表 `IDataProviderRegistry`
  - `RegistryManager#createDataProvider(String modId)`
  - 提供了 `<T extends DataProvider> IDataProviderRegistry#put(Function<IDataGenContext, ? extends T> builder, boolean run)` 来添加 `DataProvider`。
- 自定义统计信息注册表 `ICustomStatRegistry`
  - `RegistryManager#createCustomStat(String modId)`
  - 提供了 `ICustomStatRegistry#register(String name, StatFormatter statFormatter)` 及其重载 `ICustomStatRegistry#register(String name)`。

### 示例
```java
IRegistry<Block> REGISTRIES = RegistryManager.create("modid", Registries.BLOCK);

IRegRef<Block> PEACH_WOOD = REGISTRIES.register("peach_wood", () -> new Block(BlockBehaviour.Properties.of());
```

