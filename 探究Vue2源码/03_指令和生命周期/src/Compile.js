import Watcher from './Watcher';

export default class Compile{
    constructor(el, vue){
        // Vue实例
        this.$vue = vue

        // Vue挂载点
        this.$el = document.querySelector(el)

        // 如果用户传入了挂载点
        if(this.$el){
            // 调用函数， 让节点变成fragment, 类似于mustache中的tokens， 实际上用的是AST

            let $fragment = this.node2Fragment(this.$el)

            // 编译
            this.compile($fragment)

            // 让编译好的内容重新上树
            this.$el.appendChild($fragment)
        }
    }
    node2Fragment(el){
        var fragment = document.createDocumentFragment()
        // console.log(fragment)

        var child ;

        // 让所有的Dom节点都进入  fragment
        while(child = el.firstChild){
            fragment.appendChild(child);
        }
        return fragment;

    }

    compile(el){

        // console.log(el)
        var reg = /\{\{(.*)\}\}/;
        // 得到子元素
        let childNodes = el.childNodes;
        var self = this;

        childNodes.forEach(node=>{
           // console.log("node-->",node.nodeType)
            var text = node.textContent;
            // console.log('text',text)
            if(node.nodeType ==1){
                self.compileElement(node)
            }else if(node.nodeType ==3 && reg.test(text)){
                // console.log('文本匹配')
                let name = text.match(reg)[1];
                self.compileText(node,name)

            }
        })
        
    }
    compileElement(node){
       //  console.log(node)
        const self = this ;
        // 获取属性列表
        var nodeAttr = node.attributes;
        // console.log(nodeAttr);
        
        // 类数组转换成数组
        Array.prototype.slice.call(nodeAttr).forEach(item=>{
            // 这里做分析指令
            // console.log('node===',node);
            var attrName = item.name
            var value = item.value

            // 获取v-后面的内容
            var dir = attrName.substring(2)
            // console.log(dir)

            // 判断是不是指令

            if(attrName.indexOf('v-')==0){
                // v-开头就是指令
                if(dir == 'model'){
                   new Watcher(self.$vue, value, value=>{
                       node.value = value
                   })
                //    console.log(node)
                   var v = self.getVueVal(self.$vue,value)
                   node.value = v
                   node.addEventListener('input',e=>{
                       var newVal = e.target.value
                       self.setVueVal(self.$vue,value, newVal )
                        
                   })

                }
                else if(dir == 'for'){
                //    console.log('for',value);

                }
                else if(dir=='if'){
                   // console.log('if',value)
                }

            }


        }) 
    }

    compileText(node, name){
        // console.log('AA',name);
       // console.log(node)
       // console.log('BB',this.getVueVal(this.$vue,name))
        node.textContent = this.getVueVal(this.$vue,name)
        new Watcher(this.$vue, name, value=>{
            node.textContent = value
           // console.log('替换value',value)
        })

    }

    getVueVal(vue,exp){
        var val = vue;
        exp = exp.split('.')
        exp.forEach(k=>{
            val = val[k];
        })
        return val
    }
    setVueVal(vue,exp,value){
        var val = vue
        exp = exp.split('.')
        exp.forEach((k,i)=>{
            if(i<exp.length-1){
                val = val[k];
            } 
            else{
                val[k] = value
            } 
        })

    }

}
