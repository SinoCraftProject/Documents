# 数据生成

*注：DataProvider 仅在 Forge 端运行，但在 common 子项目中创建和注册*

## 使用

### IDataGenContext

`IDataGenContext` 类提供创建 `DataProvider` 所需的必要信息，包括 `ModId`，`PackOutput`，`HolderLookup.Provider` 等。

## 注册

数据生成通过 `RegistryManager` 注册：

```java
IDataProviderRegister register = RegistryManager.obtainDataProvider(MODID);

register.put((context) -> {
    // context: IDataGenContext
    // 返回一个 DataProvider
});
```

## 内置 Data Provider

- `AbstractAdvancementProvider`：注册新进度

- `AbstractBiomeModifierProvider`：注册 `BiomeModifier`，允许向已有维度添加自定义世界生成

- `AbstractBlockTagsProvider`，`AbstractItemTagsProvider`：方块和物品 Tag

- `AbstractLanguageProvider`：语言文件

- `AbstractLootTableProvider`：方块、实体、钓鱼等奖励箱列表

- `AbstractRecipeProvider`：各种配方

- `AbstractDatapackBuiltinEntriesProvider`：Minecraft 原版数据包对象

- `AbstractCodecProvider`：其他使用 `Codec` 创建的文件

- `AbstractItemModelProvider`：物品模型生成

## 继承自 Forge 提供的 Provider

可以直接在 forge 子模块的 `DataProvider`。在 forge 子模块，创建一个 `ForgeProvider.IForgeProviders` 接口的实现类，并在 common 子模块注册一个 `ForgeProvider` 类型的 `DataProvider` 即可。


- 无论一个 Mod 中有多少个 `IForgeProviders`，只需要注册一个 `ForgeProvider` 即可

- `IForgeProviders` 实现类必须有一个无参构造



```java
// forge 子模块
public class TestForgeProviders implements ForgeProvider.IForgeProviders {

    @Override
    public String getModId() {
        return SinoTest.MODID;
    }

    @Override
    public List<DataProvider> allProviders(IDataGenContext context) {
        return List.of(new TestBlockStateProvider(context));
    }
}

// common 子模块
public class TestDatagen {

    public static void registerProvider() {
        IDataProviderRegister register = 
            RegistryManager.obtainDataProvider(SinoTest.MODID);
        register.put(ForgeProvider::new);
    }
}
```

## 自定义 Provider

在没有特殊需求的情况下，直接实现 `DataProvider` 接口及其各方法即可。

### Forge DataProvider

Forge 本身提供了很多辅助创建 Mod 的工具类和预设 `DataProvider`。可以在 Forge 子模块创建 `DataProvider`，并在 common 包使用。

由于 Architectury 项目的依赖关系，要想使用 Forge 包的 `DataProvider`，需要实现以下几个类：

- `ForgeDataProviderBase`：在 common 包使用的 `DataProvider`。其中 `generateData` 方法用于收集需要生成的数据

- `ProviderDelegateBase`：持有 Forge 端 `DataProvider` 的代理类，common 端添加数据的工具类

Forge 预定义的 `DataProvider` 有两种情况：

- 类中有一个方法单独用于收集数据。大多数 `DataProvider` 都是这种

- 构造函数中传入全部数据的集合，如 `ForgeAdvancementProvider` 和 `DatapackBuiltinEntriesProvider`

两种情况分别对应 `ForgeDataProviderBase` 类中 `generateData` 方法的调用位置不同。前者需要在 Forge 端具体 `DataProvider` 的实现类中的对应方法中调用，后者则不需要手动调用，但需要使用 `DataProviderBuilderBase` 类创建对应的 `DataProvider`。

#### 例：独立方法收集数据

在独立的方法中收集数据的一个例子是 `LanguageProvider`。在 Forge 中，该类提供一个 `addTranslations()` 方法用于收集所有语言信息。

首先，是 common 子模块的工作。common 子模块无法访问 forge 子模块的细节，因此 `DataProvider` 的信息在 common 包是无法得知的。

创建对应的代理子类继承 `ProviderDelegateBase` 类。使用接收 `DataProvider` 的构造函数。在这个类中，我们可以添加用于添加数据的辅助方法。

```java
public abstract class LanguageProviderDelegateBase
        extends ProviderDelegateBase<LanguageProviderDelegateBase> {

    protected LanguageProviderDelegateBase(DataProvider provider) {
        super(provider);
    }

    public abstract void addBlock(Block key, String name);

    public abstract void addItem(Item key, String name);

    public abstract void add(String key, String value);
}
```

之后，创建 common 包中使用的 `DataProvider`，实现 `ForgeDataProviderBase<T>` 类，其中泛型类型就是刚刚创建的 `LanguageProviderDelegateBase` 类。

在这里我们需要一个 `@ExpectPlatform` 的方法，通过该方法将构造函数中创建代理类 `LanguageProviderDelegateBase` 的工作传递给 Forge 平台，并在其他平台直接抛出异常即可。

```java
public abstract class AbstractLanguageProvider
        extends ForgeDataProviderBase<LanguageProviderDelegateBase> {

    public AbstractLanguageProvider(IDataGenContext context, String locale) {
        super(createDelegate(context, locale));
    }

    @ExpectPlatform
    public static LanguageProviderDelegateBase createDelegate(IDataGenContext context, String locale) {
        throw new AssertionError();
    }
}
```

至此，common 子模块的准备工作便完成了。下面的工作在 forge 子模块完成：

在 Forge 端，我们首先要创建一个 `DataProvider` 类 `LanguageProvider` 的实现类。在这个类中，我们需要传入一个代理类 `LanguageProviderDelegateBase` 的实例，并在正确的地方调用 `generateData()` 方法。

```java
public class ForgeLanguageProviderImpl extends LanguageProvider {
    private ForgeLanguageProviderDelegateImpl delegate;

    ForgeLanguageProviderImpl(IDataGenContext context, String locale) {
        super(context.getOutput(), context.getModId(), locale);
    }

    public void setDelegate(ForgeLanguageProviderDelegateImpl delegate) {
        this.delegate = delegate;
    }

    @Override
    protected void addTranslations() {
        delegate.generateData();
    }
}
```

之后，创建代理类 `LanguageProviderDelegateBase` 的实现类。在这个类中，我们要做的事情是将数据传递给对应的 `DataProvider` 实现类，这个 `DataProvider` 可以从 `getForgeProvider()` 方法获取。

```java
public class ForgeLanguageProviderDelegateImpl
        extends LanguageProviderDelegateBase {

    private final ForgeLanguageProviderImpl provider;

    public ForgeLanguageProviderDelegateImpl(IDataGenContext context, String locale) {
        super(new ForgeLanguageProviderImpl(context, locale));
        provider = getForgeProvider();
        provider.setDelegate(this);
    }

    @Override
    public void addBlock(Block key, String name) {
        provider.add(key, name);
    }

    @Override
    public void addItem(Item key, String name) {
        provider.add(key, name);
    }

    @Override
    public void add(String key, String value) {
        provider.add(key, value);
    }
}
```

最后，遵循 Architectury 的要求，实现之前的 `@ExpectPlatform` 方法即可

```java
public class AbstractLanguageProviderImpl {

    public static LanguageProviderDelegateBase createDelegate(IDataGenContext context, String locale) {
        return new ForgeLanguageProviderDelegateImpl(context, locale);
    }
}
```

#### 例：构造函数收集数据

在构造函数中就收集完所有数据信息的一个例子是 `DatapackBuiltinEntriesProvider`。在构造函数中，该类接受一个 `RegistrySetBuilder` 对象，包含了所有可用数据。

首先，在 common 子模块中的准备与上个例子里使用的差不多，只是在创建代理类 `ProviderDelegateBase` 时使用接收 `DataProviderBuilderBase` 的构造函数。

```java
public abstract class DatapackProviderDelegateBase
         extends ProviderDelegateBase<DatapackProviderDelegateBase> {

    protected DatapackProviderDelegateBase(DataProviderBuilderBase<?, ?> builder) {
        super(builder);
    }

    public abstract <T> void add(ResourceKey<? extends Registry<T>> type, Consumer<BootstapContext<T>> register);
}
```

```java
public abstract class AbstractDatapackBuiltinEntriesProvider
        extends ForgeDataProviderBase<DatapackProviderDelegateBase> {

    public AbstractDatapackBuiltinEntriesProvider(IDataGenContext context) {
        super(createDelegate(context));
    }

    @ExpectPlatform
    public static DatapackProviderDelegateBase createDelegate(IDataGenContext context) {
        throw new AssertionError();
    }
}
```

在 forge 包中，还是先创建 `DataProvider` 实例

```java
public class ForgeDatapackBuiltinEntriesProviderImpl extends DatapackBuiltinEntriesProvider {

    private final String name;

    public ForgeDatapackBuiltinEntriesProviderImpl(IDataGenContext context, RegistrySetBuilder builder, String name) {
        super(context.getOutput(), context.registriesFuture(), builder, Set.of(context.getModId()));
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
```

之后，创建 `DataProvider` 的构造类，在其中需要提供创建方法和 `DataProvider` 名称，该名称将传递给 common 包的 `getName` 方法。

DataProviderBuilderBase 类的两个泛型分别是代理类实现类型和 `DataProvider` 的实现类型。

```java
public class ForgeDatapackProviderBuilderImpl
        extends DataProviderBuilderBase<ForgeDatapackProviderDelegateImpl, ForgeDatapackBuiltinEntriesProviderImpl> {

    private final IDataGenContext context;

    public ForgeDatapackProviderBuilderImpl(IDataGenContext context) {
        this.context = context;
    }

    @Override
    public ForgeDatapackBuiltinEntriesProviderImpl build(ForgeDatapackProviderDelegateImpl delegate) {
        // todo 创建 DataProvider
    }

    @Override
    public String getDataProviderName() {
        return "Registries: " + context.getModId();
    }
}
```

创建对应的代理类，在构造函数中创建对应的 Builder

```java
public class ForgeDatapackProviderDelegateImpl extends DatapackProviderDelegateBase {

    // RegistryBootstrap 内 key 依赖于注册先后顺序
    private List<Entry> entries = new ArrayList<>();
    private Entry lastEntry = null;

    public ForgeDatapackProviderDelegateImpl(IDataGenContext context) {
        super(new ForgeDatapackProviderBuilderImpl(context));
    }

    public List<Entry> getData() {
        return entries;
    }

    @Override
    public <T> void add(ResourceKey<? extends Registry<T>> type, Consumer<BootstapContext<T>> register) {
        if (lastEntry != null && Objects.equals(lastEntry.type, type)) {
            lastEntry.consumer = Functions.compose(lastEntry.consumer, register);
        } else {
            entries.add(lastEntry = new Entry(type, register));
        }
    }

    public static class Entry {
        final ResourceKey type;
        Consumer consumer;

        public Entry(ResourceKey type, Consumer consumer) {
            this.type = type;
            this.consumer = consumer;
        }
    }
}
```

最后，实现前面的 `build` 方法和 `@ExpectPlatform` 方法

```java
public class AbstractDatapackBuiltinEntriesProviderImpl {

    public static DatapackProviderDelegateBase createDelegate(IDataGenContext context) {
        if (context instanceof ForgeDataGenContextImpl impl) {
            return new ForgeDatapackProviderDelegateImpl(impl);
        }
        throw new ClassCastException("Can't cast " + context + " to ForgeDataGenContextImpl at Forge Platform. " +
                "Use SinoCorePlatform#buildDataGeneratorContext to create this context. " +
                "Don't use context implemented yourself, because it contains different information in different platform");
    }
}
```

```java
public class ForgeDatapackProviderBuilderImpl
        extends DataProviderBuilderBase<ForgeDatapackProviderDelegateImpl, ForgeDatapackBuiltinEntriesProviderImpl> {
    // ...

    @Override
    public ForgeDatapackBuiltinEntriesProviderImpl build(ForgeDatapackProviderDelegateImpl delegate) {
        RegistrySetBuilder builder = new RegistrySetBuilder();
        delegate.getData().forEach(entry -> builder.add(entry.type, ctx -> entry.consumer.accept(ctx)));
        return new ForgeDatapackBuiltinEntriesProviderImpl(context, builder, getDataProviderName());
    }
}
```
