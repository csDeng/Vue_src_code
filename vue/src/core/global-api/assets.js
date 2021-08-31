/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
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
