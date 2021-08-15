/**
 * 把tokens渲染成DOM
 * 
 */
import lookup from './lookup'
import parseArray from './parseArray'
const {log} = console
export default function renderTemplate(tokens,data){
    // log(tokens,data)
    let ans = ''
    // 遍历tokens
    for(let i = 0; i<tokens.length; i++){
        let token = tokens[i];

        if(token[0] === 'text'){
            ans += token[1]
        }
        else if(token[0] === 'name'){
            ans += lookup(data, token[1])
        }
        else if(token[0] === '#'){
            ans += parseArray(token,data)
        }

    }

    // log('渲染结果',ans)
    // 渲染
    return ans

}