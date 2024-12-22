# VoxelShapeHelper

`VoxelShapeHelper`封装了对`VoxelShape`的常见操作。

- `VoxelShape combine(VoxelShape... shapes)`
  - 合并若干个`VoxelShape`：
    - 传入空数组则等价于`Shapes.empty()`；
    - 只有一个则原样返回第一个元素。
- `VoxelShape exclude(VoxelShape base, VoxelShape... shapes)`
  - 从`base`中挖空去`shapes`的每一个元素。
