export default  {
    // template:`<div>aa</div>`    // 会报错： You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
    // h(tag, data, children)

    /**
     @解决嵌套路由
     1. 深度标记
     2. 路由匹配时获取代表深度层级的 matched 数组
     */
    render(h) {
        // 标记当前router-view的深度
        console.info("render里面的$vnode=", this.$vnode)
        this.$vnode.data.routerView = true
        let depth = 0
        let parent = this.$parent

        while(parent){
            const vnodeData = parent.$vnode && parent.$vnode.data
            if(vnodeData){
                if(vnodeData.routerView){
                    // 如果当前parent是一个router-view
                    depth += 1
                }
            }

            // 向上查找parent
            parent = parent.$parent
        }

        // const {routeMap, current} = this.$router

        // // const {routeMap, app:{current}} = this.$router
        // console.log(current)
        // let component = routeMap.get( current ) || null;
        // console.log('路由表',this.$router.routeMap)


        // 解决嵌套路由
        let component = null
        const route = this.$router.matched[depth]
        if(route){
            component = route.component
        }
        return h(component)
    }
}