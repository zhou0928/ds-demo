import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";


Vue.use(Router)

const router = new Router({
    routes: [
        // 重定向
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {path: '/HOME', component: Home}
    ]
})

//挂载路由导航守卫

// 挂载路由导航守卫,控制访问权限
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //  next() 放行  next('/login')  强制跳转到login路径
    if (to.path === '/login') {
        return next()
    }
    // 用户不是访问登录页，获取浏览器sessionStroage中的token
    // 存在的的话，放行，
    // 不存在的话，跳转至登录页
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        // 不存在
        return next('/login')
    } else {
        // 存在
        return next()
    }

})

export default router






