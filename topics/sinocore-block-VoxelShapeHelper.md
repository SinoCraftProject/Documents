# VoxelShapeHelper

`VoxelShapeHelper` 工具类提供了对 `VoxelShape` 的旋转支持：

- `VoxelShape rotateHorizontal(VoxelShape shape, Direction from, Direction to)`：以竖直方向（Y轴）为轴从 `from` 到 `to` 朝向旋转 `shape` 。
- `VoxelShape rotateClockwise(VoxelShape shape)`：以竖直方向（Y轴）为轴顺时针旋转 `shape` 1 次。
- `VoxelShape rotateClockwise(VoxelShape shape, int times)`：以竖直方向（Y轴）为轴顺时针旋转 `shape` `times` 次。
