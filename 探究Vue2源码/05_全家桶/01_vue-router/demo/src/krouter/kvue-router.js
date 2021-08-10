/*
1. 实现一个插件，挂载$router
*/
import View from './krouter-view';
import Link from './krouter-link';
let Vue;

class KVueRouter {
    constructor(options) {
        this.$options = options
        // 让this.current 成为响应式
        // Vue.util.defineReactive(this, 'current', '/')
        // 也可以用下面这种写法来代替util.defineReactive
        // 开Vue实例这种方式的话，记得修改hashChange函数，以及View组件
        // this.app  = new Vue({
        //     data(){
        //         return {
        //             current: '/'
        //         }
        //     }
        // })

        // this.current = '/'

        // 嵌套式路由
        this.current = window.location.hash.slice(1) || '/'
        Vue.util.defineReactive(this, 'matched', [])
        // match方法递归遍历路由表，获得匹配关系数组
        this.match()

        // 监听url变化
        window.addEventListener('hashchange',onhashchange.bind(this))

        // 解决进入时的当前路由匹配
        window.addEventListener('load',onhashchange.bind(this))

        function onhashchange(){
            // 注意函数上下文于类上下文的不一致
            // console.log('hashchange',window.location)
            // 获取BOM 的location的hash路径
            this.current = window.location.hash.slice(1)

            this.matched = []
            this.match()

            // this.app.current = window.location.hash.slice(1)
            // console.log("当前的url=", this.current)
        }
        // 创建路由映射表,建立备忘录优化每次都遍历路由表达到性能优化
        // [{path:componentFunction},{}]
        this.routeMap = new Map()
        options.routes.forEach(route => {
            this.routeMap.set(route.path, route.component)
        })
    }

    match(routes){
        routes = routes || this.$options.routes
        // 递归遍历
        for(const route of routes){
            if( route.path === '/' && this.current === '/'){
                this.matched.push(route)
                return
            }
            
            // /A/B
            if( route.path !== '/' && this.current.indexOf(route.path)!= -1 ){
                this.matched.push(route)
                if( route.children ){
                    this.match(route.children)
                }
                return
            }
        }
    }
}

KVueRouter.install = function (_Vue) {
    // 1. 保存构造函数，在KVueRouter 里面使用
    Vue = _Vue
    // 2. 挂载$router 
    // 3. 怎么获取根实例中的router选项
    // 全局混入，这里写的生命钩子，将来在每个函数都会执行
    Vue.mixin({
        beforeCreate() {
            // console.log('mixin', this)
            // 确保是根实例的时候才执行
            if (this.$options && this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })
    Vue.component('router-view', View)
    Vue.component('router-link', Link)
}


export default KVueRouter;
