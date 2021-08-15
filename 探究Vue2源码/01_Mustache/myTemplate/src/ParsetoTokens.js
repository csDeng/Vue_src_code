import Scanner from './Scanner';

export default function ParsetoTokens(templateStr){
    var tokens = [];

    // 创建扫描器
    var scanner = new Scanner(templateStr);
    var words = null ;
    // 让扫描器工作
    while(!scanner.eos()){
        // 1、收集标记出现之前的文字
        words = scanner.scanUtil('{{')

        // 2、 存起来
        // 过滤空格
        if(words != ''){
            if(words[0]=='#'){
                // 去掉第一个#
                tokens.push(['#',words.substring(1).trim()])
            }
            else if(words[0]=='/'){
                tokens.push(['/',words.substring(1)])
            }else{
                tokens.push(['text',words.trim()])
            }
            
        }
        
        // 3、 过双大括号
        scanner.scan('{{')

        words = scanner.scanUtil('}}')
        if(words != ''){
            if(words[0]=='#'){
                // 去掉第一个#
                tokens.push(['#',words.substring(1).trim()])
            }
            else if(words[0]=='/'){
                tokens.push(['/',words.substring(1).trim()])
            }else{
                tokens.push(['name',words.trim()])
            }
        }
        scanner.scan('}}')
    }


    return tokens;
}