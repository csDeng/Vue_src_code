/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

/**
 * 
export function validateComponentName (name: string) {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }

  // 如果已经是内置的html标签或者组件名字已存在
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}
 */

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]   
    
   */
  ASSET_TYPES.forEach(type => {
    /**
     * @Vue[component] = function(id, definition){}
     */
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }

        // def 是对象
        if (type === 'component' && isPlainObject(definition)) {
          // 组件的名字
          definition.name = definition.name || id
          /**
           * extend 创建组件构造函数，def变成了构造函数
           */
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }

        // 注册， this.options[components]['name'] = xx
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
