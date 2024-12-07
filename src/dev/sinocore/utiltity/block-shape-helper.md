# BlockShapeHelper

`BlockShapeHelper` 工具类提供了以方块为单位操作 `VoxelShape` 的常见工具方法。

- `VoxelShape rotateX(VoxelShape shape)`：以X轴顺时针旋转 `shape`。
- `VoxelShape rotateY(VoxelShape shape)`：以Y轴顺时针旋转`shape`。
- `VoxelShape or(VoxelShape[] shapes)`：封装了 `Shapes.or(VoxelShape shape1, VoxelShape shape2)` 和 `Shapes.or(VoxelShape shape1, VoxelShape... others)` ，用于合并若干个 `VoxelShape`。
