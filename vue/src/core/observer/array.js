/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 获取数组原型，备份
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */

// 覆盖七个方法
methodsToPatch.forEach(function (method) {
  // cache original method
  /**
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

   */
  
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    // 执行原来的动作
    const result = original.apply(this, args)

    const ob = this.__ob__

    // 如果是插入的操作，还需要额外的响应化处理
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 怀疑插入的是一个新数组，对他进行响应式
    if (inserted) ob.observeArray(inserted)
    // notify change  通知watcher更新
    ob.dep.notify()
    return result
  })
})
