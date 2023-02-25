import axios from "axios";

const LoginApi = {
  /*
  * login.js
  */
  loginApi(data) {
    return axios({
      'url': '/employee/login',
      'method': 'post',
      data
    })
  },
  logoutApi() {
    return axios({
      'url': '/employee/logout',
      'method': 'post',
    })
  }
}

export default LoginApi