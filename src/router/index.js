import VueRouter from "vue-router";
import Vue from "vue";
import login from "@/views/Login";
// import home from "@/views/Home";
import memberList from "@/views/member/MemberList";
import Layout from "@/views/layout";
import CategoryList from "@/views/category/CategoryList";
import OrderList from "@/views/order/OrderList";
import FoodList from "@/views/food/FoodList";
import memberAdd from "@/views/member/MemberAdd";
import memberUpdate from "@/views/member/MemberUpdate";
import FoodAdd from "@/views/food/FoodAdd";
import FoodUpdate from "@/views/food/FoodUpdate";
import ComboList from "@/views/combo/ComboList";
import ComboAdd from "@/views/combo/ComboAdd";
import ComboUpdate from "@/views/combo/ComboUpdate";

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        component:login
    },
    {
        path:'/home',
        component:Layout,
        children:[
            {
                path:'memberlist',
                component:memberList
            },
            {
                path: 'memberadd',
                component: memberAdd
            },
            {
                path: 'memberupdate',
                component: memberUpdate
            },
            {
                path:'category',
                component: CategoryList
            },
            {
                path: 'orderlist',
                component: OrderList
            },
            {
                path: 'combolist',
                component: ComboList
            },
            {
                path: 'comboadd',
                component: ComboAdd
            },
            {
                path: 'comboupdate',
                component: ComboUpdate
            },
            {
                path: 'foodlist',
                component: FoodList
            },
            {
                path: 'foodadd',
                component: FoodAdd
            },
            {
                path: 'foodupdate',
                component: FoodUpdate
            }
        ]
    },
]

const router = new VueRouter({
    routes
})

export default router