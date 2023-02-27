<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login">
        登录
      </div>
<!--      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login_form" label-width="0px">-->
<!--        <el-form-item label="用户名" prop="username">-->
<!--          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" maxlength="20"-->
<!--                    prefix-icon="iconfont icon-user"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="密码" prop="password">-->
<!--          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="iconfont icon-lock"-->
<!--                    maxlength="20"-->
<!--                    @keyup.enter.native="handleLogin"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item class="btns">-->
<!--          <el-button class="login-btn" size="medium" type="primary"-->
<!--                     @click.native.prevent="handleLogin">-->
<!--            <span>登录</span>-->
<!--          </el-button>-->
<!--          <el-button @click="resetForm('loginForm')">重置</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->

      <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-width="100px" class="login_form">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.number="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="handleLogin('loginForm')">登录</el-button>
<!--          <el-button @click="resetForm('loginForm')">重置</el-button>-->
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import api from '../api/login'

export default {
  name: 'MyLogin',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
    }
  },
  computed: {
    loginRules() {
      const validateUsername = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        'username': [{'validator': validateUsername, 'trigger': 'blur'}],
        'password': [{'validator': validatePassword, 'trigger': 'blur'}]
      }
    }
  },
  created() {
  },
  methods: {
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          let res = await api.loginApi(this.loginForm)
          console.log(res)
          if (String(res.data.code) === '1') {
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            this.$router.push({path: '/home/memberlist'})
          } else {
            this.$message.error('用户名或者密码错误')
          }
        }
      })
    },
  }
}
</script>

<style scoped>

.login{
  text-align: center;
  font-size: 30px;
}

.login_container{
  background: #2b4b6b;
  height:100%;

}
.login_box{
  width: 450px;
  height: 240px;
  background-color: rgba(255, 255, 255, 0.418);
  border-radius:5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 90%;
  padding: 0 20px;
  box-sizing: border-box;

}
.btns{
  display: flex;
  justify-content: center;
}

</style>