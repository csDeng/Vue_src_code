// 模板编译
/**
 * 1. 递归遍历dom树
 * 判断节点类型： 如果是文本，则判断是否是文本插值
 * 如果是元素，则遍历其属性，判断是否是指令或事件，然后递归子元素
 */

class Compile{
    // el 是宿主元素
    // vm 是kvue实例
    constructor(el,vm){
        this.$vm = vm;
        this.$el = document.querySelector(el);

        if(this.$el){
            // 执行编译
            this.compile(this.$el)
        }

    }

    compile(el){
        // 遍历el树
        const childNodes = el.childNodes;
        Array.from( childNodes ).forEach(node=>{
            if( this.isElement(node)){
                // 判断是否是元素
                console.log('编译元素',node.nodeName)
                this.compileElement(node)
            }else if( this.isInter(node)){
                // 判断是否是插值文本
                console.log('编译插值绑定', node.textContent)
                this.compileText(node)
            }

            // 递归子节点
            if(node.childNodes && node.childNodes.length>0 ){
                this.compile(node)
            }
        })
    }       // compile

    // 插值编译
    compileText(node){
        console.log( 'compileText拿到的key',RegExp.$1 )
        node.textContent = this.$vm[RegExp.$1]
        this.update( node, RegExp.$1, 'text')
    }

    // 元素编译
    compileElement(node){
        // 获取元素上面的attributes
        const nodeAttrs = node.attributes
        Array.from( nodeAttrs ).forEach(attr=>{
            // 规定 指令为 k-xx = 'oo'
            const attrName = attr.name   // k-xx
            const exp = attr.value      // oo

            if( this.isDirective( attrName)){
                const dir = attrName.substring(2) // xx
                this[dir] && this[dir](node, exp)
            }
        })
    }

    update(node, exp, dir){
        // 初始化
        // 指令对应的更新函数 xxUpdater
        const fn = this[dir + 'Updater']
        fn && fn( node, this.$vm[exp])

        // 更新处理, 封装一个更新函数，可以更新对应的dom元素
        new Watcher(this.$vm, exp, function(val){
            fn && fn(node, val)
        })
    }

    textUpdater(node, val) {
        node.textContent = val
    }


    // 帮助函数
    isElement(node){
        return node.nodeType === 1
    }

    isInter(node){
        // 首先是文本标签， 其次内容是{{xx}}
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    isDirective(attr){
        return attr.indexOf('k-') === 0
    }


    // 定义指令 k-text
    text(node, exp) {
        this.update(node, exp, 'text')
    }

    textUpdater(node, val){
        node.textContent = val
    }
    // k-html
    html(node, exp){
        this.update(node, exp, 'html')
    }

    htmlUpdater(node,val) {
        node.innerHTML = val
    }

    /**
     * @TODO 事件绑定，双向绑定
     * @param {*} node
     * @param {*} exp
     */
    on(node, exp){

    }


}