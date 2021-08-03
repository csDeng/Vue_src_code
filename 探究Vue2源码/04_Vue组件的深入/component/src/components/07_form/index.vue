<template>
  <div>
    <!-- KForm -->
    <KForm :model="userInfo" :rules="rules" ref="loginForm">
      <!-- 用户名 -->
      <KFormItem label="用户名" prop="username">
        <KInput v-model="userInfo.username" placeholder="请输入用户名"></KInput>
      </KFormItem>
      <!-- 密码 -->
      <KFormItem label="密码" prop="password">
        <KInput type="password" v-model="userInfo.password" placeholder="请输入密码"></KInput>
      </KFormItem>
      <!-- 提交按钮 -->
      <KFormItem>
        <button @click="login">登录</button>
      </KFormItem>
    </KForm>
  </div>
</template>

<script>
/**
手写一个form通用组件
1. 创建form组件，formItem组件，以及input组件
2. 在input输入
3. 在item进行校验像校验
4. 在form进行全局校验

 */

import KInput from "./KInput.vue";
import KFormItem from "./KFormItem.vue";
import KForm from "./KForm.vue";
import Notice from './Notice.vue';

export default {
  data() {
    return {
      userInfo: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名称" }],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  components: {
    KInput,
    KFormItem,
    KForm
  },
  methods: {
    login() {
      // 进行全局校验
      this.$refs["loginForm"].validate(valid => {
        // $create是一个手动挂载的函数工具，在utils中，返回的是一个组件实例
        const notice = this.$create(Notice, {
          title: "社会你杨哥喊你来搬砖",
          message: valid ? "请求登录!" : "校验失败!",
          duration: 2000
        });
        notice.show();
        // if (valid) {
        //   alert("submit");
        // } else {
        //   console.log("error submit!");
        //   return false;
        // }
      });
    }
  }
};
</script>

<style scoped>
</style>