# BlockShapeHelper

`BlockShapeHelper`封装了以方块的像素为单位操作`VoxelShape`的常见操作。  
常用于处理由`Block.box(double x1, double y1, double z1, double x2, double y2, double z2)`构造的`VoxelShape`。

- `VoxelShape rotateX(VoxelShape shape)`
  - 绕X轴顺时针旋转`shape`。
- `VoxelShape rotateY(VoxelShape shape)`
  - 绕Y轴顺时针旋转`shape`。
