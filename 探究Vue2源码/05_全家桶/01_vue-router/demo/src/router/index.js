import Vue from 'vue';
import vueRouter from 'vue-router'
Vue.use(vueRouter)

const router = new vueRouter({
    mode: 'hash',
    routes:[
        {
            path:'/',
            component: ()=>import('../components/HelloWorld')
        },
        {
            path:'/A',
            component: ()=>import('../components/A.vue')
        }
    ]
})



export default router;