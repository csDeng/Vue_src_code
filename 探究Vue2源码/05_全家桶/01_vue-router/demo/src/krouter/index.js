import Vue from 'vue';
import vueRouter from './kvue-router'
Vue.use(vueRouter)

/** 
 * @render函数
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
 */
const router = new vueRouter({
    mode: 'hash',
    routes:[
        {
            path:'/',
            component: ()=>import('../components/HelloWorld')
        },
        {
            path:'/A',
            component: ()=>import('../components/A.vue'),
            children:[
                {
                    path:'/B',
                    component: { render(h){ return h('div','B')}}
                },
                {
                    path:'/C',
                    component: {render(h){ return h('p','CCCC')}}
                }
            ]
        }
    ]
})



export default router;