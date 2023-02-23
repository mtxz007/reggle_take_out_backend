<template>
<!--  <div id="login" v-loading="loading">-->
<!--    <div class="divHead">登录</div>-->
<!--    <div class="divContainer">-->
<!--      <el-input placeholder=" 请输入手机号码" v-model="form.phone"  maxlength='20'></el-input>-->
<!--      <div class="divSplit"></div>-->
<!--      <el-input placeholder=" 请输入验证码" v-model="form.code"  maxlength='20'></el-input>-->
<!--      &lt;!&ndash;                <span @click="getCode">获取验证码</span>&ndash;&gt;-->
<!--      <span v-if="codeShow" @click="getCode">获取验证码</span>-->
<!--      &lt;!&ndash; 倒计时 &ndash;&gt;-->
<!--      <span v-if="!codeShow">{{count}}秒后重试</span>-->
<!--    </div>-->
<!--    <div class="divMsg" v-if="msgFlag">手机号输入不正确，请重新输入</div>-->
<!--    <el-button type="primary" :class="{btnSubmit:1===1,btnNoPhone:!form.phone,btnPhone:form.phone}" @click="btnLogin">登录</el-button>-->
<!--  </div>-->


  <van-form @submit="btnLogin">
    <van-field
        v-model="form.phone"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请输入手机号码' }]"
    />
    <van-field
        v-model="form.code"
        name="验证码"
        label="验证码"
        placeholder="验证码"
        :rules="[{ required: true, message: '请填写密码' }]"
    />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="button" @click="getCode">获取验证码</van-button>
      <van-button round block type="info" native-type="submit">登录</van-button>
    </div>
  </van-form>
</template>

<script>
  import LoginApi from "@/api/login";
  import axios from "axios";

  export default {
    name: "MyLogin",
    data(){
      return {
        codeShow: true,
        count: '',
        timer: null,
        form:{
          phone:'',
          code:''
        },
        msgFlag:false,
        loading:false
      }
    },
    computed:{},
    created(){},
    mounted(){},
    methods:{
      getCode(){
        console.log('getCode...',this.form.phone)
        this.form.code = ''
        const regex = /^(13[0-9]{9})|(15[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})|(19[0-9]{9})$/;
        if (regex.test(this.form.phone)) {
          this.msgFlag = false;
          // this.form.code = (Math.random()*1000000).toFixed(0)
          // sendMsgApi({phone:this.form.phone})
          //下面这段是我改的
          axios({
            method: 'post',
            url: '/user/sendMsg',
            data: {
              phone:this.form.phone
            }
          }).then(res=>{
            console.log(res.data)
            this.form.code = res.data.data;
          })

          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.codeShow = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.codeShow = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000)
          }
        }else{
          this.msgFlag = true
        }
      },
      async btnLogin(){
        if(this.form.phone && this.form.code){
          this.loading = true
          const res = await LoginApi.loginApi(this.form)
          this.loading = false
          console.log('登录res：',res)
          if(res.data.code === 1){
            sessionStorage.setItem("userPhone",this.form.phone)
            // window.requestAnimationFrame(()=>{
            //   window.location.href= '/front/index.html'
            // })
            this.$router.push('/index')
          }else{
            this.$notify({ type:'warning', message:res.data.msg});
          }
        }else{
          this.$notify({ type:'warning', message:'请输入手机号码'});
        }
      }
    }
  }
</script>

<!--<style scoped>-->
<!--  #login .divHead {-->
<!--    opacity: 1;-->
<!--    background: #333333;-->
<!--    height: 88rem;-->
<!--    width: 100%;-->
<!--    font-size: 18rem;-->
<!--    font-family: PingFangSC, PingFangSC-Regular;-->
<!--    font-weight: 500;-->
<!--    text-align: center;-->
<!--    color: #ffffff;-->
<!--    line-height: 88rem;-->
<!--  }-->

<!--  #login .divContainer {-->
<!--    width: 356rem;-->
<!--    height: 128rem;-->
<!--    opacity: 1;-->
<!--    background: #ffffff;-->
<!--    border-radius: 6rem;-->
<!--    margin: 0 auto;-->
<!--    margin-top: 10rem;-->
<!--    position: relative;-->
<!--  }-->

<!--  #login .divContainer input {-->
<!--    border: 0;-->
<!--    height: 63rem;-->
<!--  }-->

<!--  #login .divContainer .divSplit {-->
<!--    height: 1px;-->
<!--    background-color: #efefef;-->
<!--    border: 0;-->
<!--    margin-left: 10rem;-->
<!--    margin-right: 10rem;-->
<!--  }-->

<!--  #login .divContainer span {-->
<!--    position: absolute;-->
<!--    right: 20rem;-->
<!--    top: 20rem;-->
<!--    cursor: pointer;-->
<!--    opacity: 1;-->
<!--    font-size: 12rem;-->
<!--    font-family: PingFangSC, PingFangSC-Regular;-->
<!--    font-weight: 400;-->
<!--    text-align: left;-->
<!--    color: #ffc200;-->
<!--    letter-spacing: 0px;-->
<!--  }-->

<!--  #login .divMsg {-->
<!--    width: 168px;-->
<!--    height: 17px;-->
<!--    opacity: 1;-->
<!--    font-size: 12px;-->
<!--    font-family: PingFangSC, PingFangSC-Regular;-->
<!--    font-weight: 400;-->
<!--    text-align: center;-->
<!--    color: #e94e3c;-->
<!--    line-height: 17px;-->
<!--    margin-left: 26rem;-->
<!--    margin-top: 10rem;-->
<!--  }-->

<!--  #login .btnSubmit {-->
<!--    width: 356rem;-->
<!--    height: 40rem;-->
<!--    margin: 20rem 10rem 0 10rem;-->
<!--    border-radius: 20px;-->
<!--    border: 0;-->

<!--    font-size: 15rem;-->
<!--    font-family: PingFangSC, PingFangSC-Regular;-->
<!--    font-weight: 500;-->
<!--    text-align: center;-->
<!--  }-->

<!--  #login .btnNoPhone {-->
<!--    color: #666666;-->
<!--    background: #d8d8d8;-->
<!--  }-->

<!--  #login .btnNoPhone:active {-->
<!--    background: #afafaf;-->
<!--  }-->

<!--  #login .btnPhone {-->
<!--    background: #ffc200;-->
<!--    color: #333333;-->
<!--  }-->

<!--  #login .btnPhone:active {-->
<!--    background: rgba(255, 142, 0, 1);-->
<!--    color: #333333;-->
<!--  }-->

<!--</style>-->