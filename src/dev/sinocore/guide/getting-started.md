# 开始使用

## 引入SinoCore

此处假设使用[Architectury Loom](https://github.com/architectury/architectury-loom)工具链。

在`build.gradle`中引入SinoCore的Maven仓库：
```groovy
repositories {
    maven {
        name = 'Yuluo Maven'
        url = 'https://maven.yuluo.dev/repository/maven-releases/'
    }
}
```
不建议使用CurseMaven或者Modrinth Maven来引入SinoCore，因为它们不包含common、source jar和javadoc jar。而且CF的版本号是fileId，而MR的版本号增加了后缀`+fabric`和`+neoforge`，都无法像maven那样引用。

把SinoCore作为依赖：
```groovy
dependencies {
    modApi group: 'games.moegirl.sinocraft', name: 'sinocore-common', version: '1.2.0'
}
```
其中，在`common`项目中`name`应为`sinocore-common`；在`neoforge`项目中则是`sinocore-neoforge`；在`fabric`项目中是`sinocore-fabric`。`version`可以替换为对应的的版本号。  
假如模组只支持NeoForge或者Fabric其中的一个，则只需要`sinocore-neoforge`或者`sinocore-fabric`，它们实际上都包含了`sinocore-common`的全部内容。

最后，为了防止未安装依赖造成游戏在加载过程中崩溃，最好在模组元数据中标明依赖SinoCore：  
SinoCore的`modid`为`sinocore`。

对于NeoForge平台，在`neoforge.mods.toml`中：
```toml
[[dependencies.${mod_id}]]
modId = "sinocore"
type = "required"
versionRange = "[1.2.0,1.3)"  # 表示1.2.0以上但低于1.3.0的版本
ordering = "AFTER"          # 需要在SinoCore加载完成后再加载
side = "BOTH"
```

对于Fabric平台，在`fabric.mod.json`中：
```json5
{
  // ...
  "depends": {
    "sinocore": "~1.2.0"  // ~表示所有1.2.x版本
  }
  // ...
}
```

也可以选择把SinoCore通过Jar-in-jar的方式打包进自己的模组来分发，NeoForge和Fabric平台均支持Jar-in-jar。在`build.gradle`中：  
```groovy
dependencies {
    include group: 'games.moegirl.sinocraft', name: 'sinocore-neoforge', version: '1.2.0'
}
```
和引入依赖类似，但只需要对`neoforge`和`fabric`项目`include`，一般模组不需要分发`common`项目；如果作为库分发，推荐使用Maven元数据的方式。
