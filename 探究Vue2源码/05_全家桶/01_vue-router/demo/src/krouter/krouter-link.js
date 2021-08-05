// 用的方式 <router-link to='xx>xx</router-link>
export default {
    props: {
        to: {
            type: String,
            required: true
        }
    },
    render(h) {
        // console.log( '默认插槽=>', this.$slots.default )
        return h('a', { attrs: { href: '#' + this.to, class: 'router-link' } }, this.$slots.default)
        // 等价于下面的jsx语法
        // return <a href={'#'+this.to}>{this.$slots.default}</a>
    }
}