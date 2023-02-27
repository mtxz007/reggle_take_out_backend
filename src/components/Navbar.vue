<template>
  <div class="navbar">
    <div class="head-lable">
      <span>{{ headTitle }}</span>
    </div>
    <div class="right-menu">
      <div class="avatar-wrapper">{{ userInfo.data.name }}</div>
<!--       <div class="logout" @click="logout">退出</div>-->
      <img src="../assets/images/icons/btn_close@2x.png" class="outLogin" alt="退出" @click="logout"/>
    </div>
  </div>
</template>

<script>
import LoginApi from "@/api/login";

export default {
  name: 'MyNabar',
  data() {
    return {
      headTitle: '员工管理',
      goBackFlag: false,
      loading: true,
      timer: null,
      userInfo: {},
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
  },
  mounted() {
  },
  watch:{
    '$route' (to, from) {
      // 在这里触发你的方法
      if (to.path === '/home/memberlist') {
        this.headTitle = '员工管理'
      } else if (to.path === '/home/memberadd') {
        this.headTitle = '添加员工'
      } else if (to.path === '/home/memberupdate') {
        this.headTitle = '修改员工'
      }  else if (to.path === '/home/category') {
        this.headTitle = '分类管理'
      } else if (to.path === '/home/orderlist') {
        this.headTitle = '订单管理'
      } else if (to.path === '/home/combolist') {
        this.headTitle = '套餐管理'
      } else if (to.path === '/home/comboadd') {
        this.headTitle = '添加套餐'
      } else if (to.path === '/home/comboupdate') {
        this.headTitle = '更改套餐'
      } else if (to.path === '/home/foodlist') {
        this.headTitle = '菜品管理'
      } else if (to.path === '/home/foodadd') {
        this.headTitle = '添加菜品'
      } else if (to.path === '/home/foodupdate') {
        this.headTitle = '更改菜品'
      } else {
        this.headTitle = ''
      }
    }
  },
  methods: {
    logout() {
      LoginApi.logoutApi().then((res) => {
        if (res.data.code === 1) {
          localStorage.removeItem('userInfo')
          this.$router.push('/')
        }
      })
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
.navbar {
  height: 64px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.navbar .head-lable {
  /* position: absolute; */
  /* background: #fff; */
  color: #333333;
  height: 64px;
  font-size: 16px;
  width: 300px;
  padding-left: 22px;
  line-height: 64px;
  font-weight: 700;
  /* top: 0px;
  left: 0px; */
  /*opacity: 0;*/
  float: left;
  animation: opacity 500ms ease-out 800ms forwards;
}
.navbar .head-lable .goBack {
  border-right: solid 1px #d8dde3;
  padding-right: 14px;
  margin-right: 14px;
  font-size: 16px;
  color: #333333;
  cursor: pointer;
  font-weight: 400;
}
.navbar .head-lable .goBack img {
  position: relative;
  top: 24px;
  margin-right: 5px;
  width: 18px;
  height: 18px;
  float: left;
}
.navbar .right-menu {
  float: right;
  display: flex;
  margin-right: 34px;
  height: 100%;
  line-height: 64px;
  color: #333333;
  font-size: 14px;
}

.navbar .right-menu .logout {
  margin-left: 20px;
  width: 28px;
  font-size: 14px;
  color: #ffc200;
  cursor: pointer;
}

.navbar .right-menu img {
  margin-top: 20px;
  margin-left: 10px;
  width: 25px;
  height: 25px;
}
.navbar .right-menu .outLogin {
  cursor: pointer;
}
.navbar .right-menu:focus {
  outline: none;
}
</style>