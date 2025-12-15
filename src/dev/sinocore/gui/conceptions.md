# 基础概念

文档中列举的方法行为均为约定，并未阻止覆写，但实现均**应当**遵循约定，调用`super`的对应方法以确保行为正确。

## 菜单（Menu）

菜单是Minecraft原有的概念，负责GUI的数据存储，会在服务端和客户端之间同步。
GUI里的物品格（Slot）在菜单中进行管理。

## 屏幕（Screen）

Screen本来是Minecraft原有的概念，指游戏中的所有GUI，只存在于客户端。
其中，在游戏内可以通过交互容器打开的通常是`AbstractContainerScreen`的子类（即带有对应Menu的Screen），其他的通常是`Screen`的子类（不带有Menu）。  

SinoCore提供了`IScreen`接口，它继承自`IWindowHolder`（窗体容器）。除特殊说明外，以下所称屏幕均为`IScreen`。  
`IScreen`是`x`和`y`坐标均为0，`width`和`height`均为游戏画面的宽高的组件（即充满整个屏幕）。  
SinoCore提供了和MC本身的两个Screen相对应的基类，它们分别实现了`IScreen`接口——`AbstractScreen`和`AbstractMenuScreen`。

## 组件（Component）

组件是GUI中的基本单元，所有实现了`IComponent`接口的类都被视为组件。
`IComponent`接口中主要提供了如下方法：
- `void tick()`：用于在每个渲染周期中更新其状态。
- `void update()`：用于**手动调用**通知组件刷新状态，通常是组件所以来的外部状态变更所致。
- `void initialize()`：用于组件的初始化。应当允许多次调用。
  - 在SinoCore的默认Screen实现中，是在`init()`的方法末尾调用。
  - 因此，当玩家缩放游戏窗口时，组件会被重新初始化。
- `void deinitialize()`：用于组件的反初始化。应当允许多次调用。
  - 在SinoCore的默认Screen实现中，是在`onClose()`方法首部调用。
- `IComposedComponent getParent()`：获取组件的上级组件。
  - 如果组件没有上级，则返回`null`。
- `void setParent(IComposedComponent parent)`：设置组件的上级组件。
- `boolean isVisible()`
- `void setVisible(boolean visible)`

## 复合组件（Composed Component）

复合组件是指那些可以包含其他组件的组件。是实现了`IComposedComponent`接口的类。
`IComposedComponent`接口中主要提供了如下方法：
- `void addChild(IComponent child)`：添加子组件。会通过子组件的`setParent`方法，设置自己为子组件的`parent`。
- `void removeChild(IComponent child)`
- `List<IComponent> getChildren()`：获取子组件列表，返回值**不可变**。
- `void clearChildren()`：清除所有子组件，实际上是使用`removeChild`方法逐个移除子组件。
- `void createChildren()`：用来创建子组件。
  - 在SinoCore的默认Screen实现中，是在构造方法的末尾调用。
  - 因此，一个屏幕中的子组件只会被创建一次，但有可能被初始化多次。

复合组件的`tick`、`update`、`initialize`和`unInitialize`方法会递归调用其所有子组件的对应方法。
这个递归调用顺序和它被添加的先后顺序一致；对应的渲染方法也是如此。
其中，除了`unInitialize`是先调用子组件再调用自身外，其他方法均是先调用自身再调用子组件。

## 窗体（Window）

窗体是一个特殊的复合组件，它可以被拖动。窗体实现`IWindow`接口。
`IWindow`接口中主要提供了如下方法：
- `void onOpen()`
- `void onClose()`
- `void onShown()`
- `void onHidden()`
- `IWindowHolder getHolder()`：获取窗体容器。

## 窗体容器（Window Holder）

窗体容器是一个特殊的复合组件，它可以包含窗体，实现`IWindowHolder`接口。
添加窗体时可以指定窗体是否为模态窗体（Modal Window），模态窗体会最先渲染，独占整个窗体容器上其他的交互操作，并且在后面渲染一个深色的覆盖层。
一个窗体容器里只能有一个模态窗体。

`IWindowHolder`接口中主要提供了如下方法：
- `List<IWindow> getWindows()`：获取窗体列表，返回值**不可变**。
- `void addWindow(IWindow window, boolean modal, boolean show)`：添加窗体。
  - `modal`参数表示该窗体是否为模态窗体，如果此容器中已经有模态窗体，则抛出`IllegalStateException`。
  - `show`参数表示添加后是否立即显示窗体。
- `void removeWindow(IWindow window)`
- `void show(IWindow window)`：显示窗体，会先调用窗体组件的`setVisible`方法，然后调用窗体的`onShown`方法。
- `void hide(IWindow window)`：隐藏窗体，会先调用窗体组件的`setVisible`方法，然后调用窗体的`onHidden`方法。
- `void closeAllWindows()`：清除所有窗体，实际上是使用`removeWindow`方法逐个移除窗体。
- `IWindow getModalWindow()`：获取当前模态窗体，如果没有模态窗体则返回`null`。

