<template>
  <div class="sidebar-container">
    <div class="logo">
      <!-- <img src="images/logo.png" width="122.5" alt="" /> -->
      <img src="images/login/login-logo.png" alt="" style="width: 117px; height: 32px"/>
    </div>

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
          :default-active="defAct"
          :unique-opened="false"
          :collapse-transition="false"
          background-color="#343744"
          text-color="#bfcbd9"
          active-text-color="#f4f4f5"
      >
        <div v-for="item in menuList" :key="item.id">
          <el-submenu :index="item.id" v-if="item.children && item.children.length>0">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
                v-for="sub in item.children"
                :index="sub.id"
                :key="sub.id"
                @click="menuHandle(sub,false)"
            >
<!--              <i :class="iconfont" :class="sub.icon"></i>-->
              <span slot="title">{{ sub.name }}</span>
            </el-menu-item
            >
          </el-submenu>
          <el-menu-item v-else :index="item.id" @click="menuHandle(item,false)">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'MyNabar',
  data() {
    return {
      defAct: '2',
      menuActived: '2',
      userInfo: {},
      menuList: [
        // {
        //   id: '1',
        //   name: '门店管理',
        //   children: [
        {
          id: '2',
          name: '员工管理',
          url: 'page/member/list.html',
          icon: 'icon-member'
        },
        {
          id: '3',
          name: '分类管理',
          url: 'page/category/list.html',
          icon: 'icon-category'
        },
        {
          id: '4',
          name: '菜品管理',
          url: 'page/food/list.html',
          icon: 'icon-food'
        },
        {
          id: '5',
          name: '套餐管理',
          url: 'page/combo/list.html',
          icon: 'icon-combo'
        },
        {
          id: '6',
          name: '订单明细',
          url: 'page/order/list.html',
          icon: 'icon-order'
        }
        //   ],
        // },
      ],
      iframeUrl: 'page/member/list.html',
      headTitle: '员工管理',
      goBackFlag: false,
      loading: true,
      timer: null
    }
  },
  computed: {},
  created() {
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
    }
    this.closeLoading()
  },
  beforeDestroy() {
    this.timer = null
    clearTimeout(this.timer)
  },
  mounted() {
    window.menuHandle = this.menuHandle
  },
  methods: {
    logout() {
      /*logoutApi().then((res) => {
        if (res.code === 1) {
          localStorage.removeItem('userInfo')
          window.location.href = '/backend/page/login/login.html'
        }
      })*/
    },
    goBack() {
      // window.location.href = 'javascript:history.go(-1)'
      const menu = this.menuList.find(item => item.id === this.menuActived)
      // this.goBackFlag = false
      // this.headTitle = menu.name
      this.menuHandle(menu, false)
    },
    menuHandle(item, goBackFlag) {
      this.loading = true
      this.menuActived = item.id
      this.iframeUrl = item.url
      this.headTitle = item.name
      this.goBackFlag = goBackFlag
      this.closeLoading()
    },
    closeLoading() {
      this.timer = null
      this.timer = setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }

}
</script>

<style scoped>
  .body{
    min-width: 1366px;
  }
  .app-main{
    height: calc(100% - 64px);
  }
  .app-main .divTmp{
    width: 100%;
    height: 100%;
  }
</style>