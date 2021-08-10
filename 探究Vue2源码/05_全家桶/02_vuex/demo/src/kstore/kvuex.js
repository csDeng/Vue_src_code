"use strict";

// 保存构造函数的使用，避免import依赖
let Vue;

/**
 * @数据统一管理
 */
class Store {
    constructor(options){
        // this.$options = options

        this._wrappedGetters = options.getters
        this._mutations = options.mutations
        this._actions = options.actions

        // 定义computed选项
        const computed = {}
    /**
     * @getters 
    getters:{
        doubleCounter(state){
            return state.counter*2;
        }
    }
     */
        this.getters = {}
        const store = this
        Object.keys(this._wrappedGetters).forEach(key=>{
            // 获取用户定义的getter
            const fn = store._wrappedGetters[key]
            computed[key] = function() {
                return fn(store.state)
            }
            // 为getters定义只读属性
            Object.defineProperty(store.getters, key, {
                get: ()=>{
                    return store._vm[key]
                }
            })

        })

        // 做响应式数据 state
        // this.state = new Vue({
        //     data: options.state
        // })

        // 避免用户直接修改state
        this._vm = new Vue({
            data:{
                $$state: options.state
            },
            computed    // 计算属性
        })



        // 绑定commit dispatch绑定上下文
        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)

        /**
         *  源码中绑定上下文的方式，利用call 
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }
         * 
         */
    }

    // 存取器 getter setter
    get state(){
        console.log("My _vm=\r\n",this._vm)
        return this._vm.$data.$$state
    }
    set state(v){
        console.error('你这样不好')
    }
    /**
     * 
     * @param {String} type 方法名 
     * @param  {any} payload 载荷参数
     * $store.commit('add', 1)
     * 
    mutations:{
        add(state){
            state.counter ++;
        }
    },
     */
    commit(type, payload){
        // 获取mutations里面的入口方法
        const entry = this._mutations[type]
        if(entry){
            entry(this.state, payload)
        }
    }
    /**
     * 
     * @param {*} type 
     * @param {*} payload
     * 
     * $store.dispatch('add',1) 
     * 
    actions:{
        add({commit}){
            setTimeout(()=>{
                commit('add')
            }, 3000)
            
        }
    },
     */
    dispatch(type,payload){
        const entry = this._actions[type]
        if(entry){
            entry(this, payload)
        }
    }

}

function install(_Vue){
    Vue = _Vue

    // 全局混入挂载$store
    Vue.mixin({
        beforeCreate(){
            if(this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

// vuex创建实例的方法
// const store = new Vuex.Store({})
export default {
    Store,
    install
}