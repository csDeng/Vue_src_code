/**
 * 在obj对象中，寻找连续点符号的key属性
 * 比如dataObj = {
 *  a: {
 *      b: {
 *          c: 99
 *          }
 *      }
 * }
 * 
 * a.b.c 的结果是99
 */

export default function lookup(dataObj, key){
    // console.log(dataObj,key);
    var temp = dataObj

    if(key.indexOf('.' !== -1 && key!=='.')){
        // 如果有点符号
        var keyArr = key.split('.')

        // console.log(keyArr);
        for(let i=0; i<keyArr.length; i++){
            temp = temp[keyArr[i]]
        }
        return temp
    }
    // 如果没有点符号
    

    return dataObj.temp
}