<template>
  <div>
    <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        router
        defalut-active="/home/memberlist">
      <el-menu-item index="/home/memberlist">
        <i class="el-icon-user"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
      <el-menu-item index="/home/category">
        <i class="el-icon-document"></i>
        <span slot="title">分类管理</span>
      </el-menu-item>
      <el-menu-item index="/home/foodlist">
        <i class="el-icon-eleme"></i>
        <span slot="title">菜品管理</span>
      </el-menu-item>
      <el-menu-item index="/home/combolist">
        <i class="el-icon-s-goods"></i>
        <span slot="title">套餐管理</span>
      </el-menu-item>
      <el-menu-item index="/home/orderlist">
        <i class="el-icon-s-order"></i>
        <span slot="title">订单处理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "MyMenu"
}
</script>

<style scoped>

</style>