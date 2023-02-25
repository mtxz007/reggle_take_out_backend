//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
//应用Vuex插件
Vue.use(Vuex)

//准备actions对象——响应组件中用户的动作
const actions = {}
//准备mutations对象——修改state中的数据
const mutations = {}
//准备state对象——保存具体的数据
const state = {
    memberUpdateId:'',  //修改员工的id，为空则为添加
    foodUpdateId:'',    //修改菜品的id，为空则为添加
    comboUpdateId:'',    //修改菜品的id，为空则为添加
}

//创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state
})