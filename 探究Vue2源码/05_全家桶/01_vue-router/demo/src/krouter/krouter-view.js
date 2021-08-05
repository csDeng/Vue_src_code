export default  {
    // template:`<div>aa</div>`    // 会报错： You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
    // h(tag, data, children)
    render(h) {
        const {routeMap, current} = this.$router

        // const {routeMap, app:{current}} = this.$router
        console.log(current)
        let component = routeMap.get( current ) || null;
        // console.log('路由表',this.$router.routeMap)
        return h(component)
    }
}