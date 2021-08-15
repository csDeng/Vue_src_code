/**
 * 扫描器类
 */

export default class Scanner{
    constructor(templateStr){
        // console.log("扫描器被创建")
        this.templateStr = templateStr
        //指针
        this.pos = 0

        // 尾巴
        this.tail = templateStr

    }

    // 功能弱，就是走过指定的内容，没有返回值
    scan(tag){
        // 跳过扫描识别符
        if(this.tail.indexOf(tag)==0){
            this.pos += tag.length
            // console.log(this.pos,tag.length)
            this.tail = this.templateStr.substring(this.pos)
        }
    }

    // 让指针扫面，直到遇到指定内容结束，并且能够返回结束之前路过的文字
    scanUtil(stopTag){
        // 记录一下执行本方法时的pos
        const pos_backup = this.pos

        // 当尾巴开头不是stopTag 的时候， 就说明没有扫描到stopTag
        // 当没有到字符串末尾时
        // this.tail.indexOf(stopTag) != 0 && this.pos<this.templateStr.length
        while(this.tail.indexOf(stopTag) != 0&&!this.eos()){
            this.pos++;
            this.tail = this.templateStr.substring(this.pos)
        }
        // console.log("scanUtil扫描结束") 
        // 返回扫描经过的字符
        return this.templateStr.substring(pos_backup,this.pos)
    }

    // end of string
    eos(){
        return this.pos >= this.templateStr.length
    }



}