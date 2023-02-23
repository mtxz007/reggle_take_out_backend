import axios from "axios";

const LoginApi = {
    loginApi(data) {
        return axios({
            'url': '/user/login',
            'method': 'post',
            data
        })
    },
    sendMsgApi(data) {
        return axios({
            'url': '/user/sendMsg',
            'method': 'post',
            data
        })
    },
    loginoutApi() {
        return axios({
            'url': '/user/loginout',
            'method': 'post',
        })
    }
}

export default LoginApi
  