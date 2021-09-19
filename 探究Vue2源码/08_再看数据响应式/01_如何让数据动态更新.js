"use strict";

let a = 1
let b = 2
let c = null;

function fn(){
    c =a+b;
}

console.log('1-',a,b,c)         // 1- 1 2 null
// 明显这里c 为null

// 调用一下函数，让c得到初始化
fn()

console.log('2-',a,b,c)         // 2- 1 2 3
// 到了这里c=3


// 依赖发生变化
a = 9
console.log('3-',a,b,c)         // 3- 9 2 3
// 这里a发生变化， 但是c并没有发生变化

fn()
console.log('4-',a,b,c)         // 4- 9 2 11
// 调用fn之后c=11，发生了变化