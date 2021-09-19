"use strict";

let store = [];
function replay(){
    store.forEach(run => run())
}
let a = 1
let b = 2
let c;
let target = ()=>{c = a+b };
store.push(target)

console.log(c)
a = 9
console.log(c)
replay()
console.log(c)
