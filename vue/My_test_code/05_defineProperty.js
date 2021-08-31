let obj = {}

Object.defineProperty(obj, 'arr',{
    enumerable: true,
    get(){
        console.log('get')
        return this.arr
    },
    set(newVal){
        console.log('set')
        this.arr = newVal
    }
})


console.log(obj.arr[1])