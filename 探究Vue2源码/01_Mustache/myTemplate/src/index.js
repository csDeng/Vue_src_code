import Parse from './ParsetoTokens';
import nestTokens from './nestTokens';
import renderTemplate from './renderTemplate'

window.SSG_TemplateEngine = {
    render(templateStr,data){
        let tokens = []
        tokens = Parse(templateStr,data)
        // log(tokens)
        tokens = nestTokens(tokens)
        let domStr = renderTemplate(tokens,data)

        return domStr
    }
}