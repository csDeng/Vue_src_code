

export default function nestTokens(tokens){
    // 结果数组
    let nestTokens = []

    let sections = []

    // 收集器，天生指向nestTokens结果数组， 引用类型值， 所以指向同一个数组
    // 收集器的指向会变化， 当遇见#号的时候，收集器会指向这个token的下标为2的数组
    let collector = nestTokens

    for(let i=0; i<tokens.length; i++){
        let token = tokens[i];
        // log('for i=='+i,token)
        switch(token[0]){
            case '#':{
                // 收集器中加入token
                collector.push(token)
                // 入栈
                sections.push(token)

                // 收集器要换人了，给token添加下标为2的项，并让collector指向它
                collector = token[2] = []
                break;
            }
            case '/':{
                // 出栈 
                sections.pop();
                // 改变收集器为栈顶，下标为2的数组

                collector = sections.length>0 ? sections[sections.length-1][2] : nestTokens
                break;
            }
            default:{
                // 此时collector可能是nestTokens或者给token添加下标为2的项
                collector.push(token)   
            }
        }
    }

    return nestTokens;
}