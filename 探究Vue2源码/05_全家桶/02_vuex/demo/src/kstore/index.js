"use strict";

// import Vuex from 'vuex';
import  Vue from 'vue';

// 使用自己手写的kvuex
import Vuex from './kvuex';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        counter: 1
    },
    mutations:{
        add(state){
            state.counter ++;
        },
        mius(state){
            state.counter --;
        }
    },
    actions:{
        add({commit}){
            setTimeout(()=>{
                commit('add')
            }, 3000)
            
        },
        mius(context){
            context.commit('mius')
        }
    },
    getters:{
        doubleCounter(state){
            return state.counter*2;
        }
    }
})

export default store;