/**
 * 结合renderTemplate 处理数组data
 * 
 * 注意函数接受的是token而不是tokens
 * token就是一个简单的 
 */

import lookup from './lookup'
import render from './renderTemplate'
// 递归调用的多少次取决于data

export default function parseArray(token,data){
    // console.log('处理数组',token,data);

    // 得到整个数据 data 中这个数组要使用的部分
    var v = lookup(data,token[1])

    // 结果字符串
    var result = ''

    for(let i=0; i<v.length; i++){
        result += render(token[2],{
            ...v[i],
            '.' : v[i]
        })


    }

    return result
} 