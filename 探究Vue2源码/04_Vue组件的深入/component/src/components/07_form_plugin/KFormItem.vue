<template>
  <div>
    <!-- label -->
    <label v-if="label">{{label}}</label>

    <slot></slot>

    <!-- 校验信息显示 -->
    <p v-if="error" id='error'>{{error}}</p>
  </div>
</template>

<script>
// Asyc-validator
import Schema from "async-validator";

export default {
  // 注入祖先组件的 form
  inject: ["form"],
  data() {
    return {
      error: "" // error是空说明校验通过
    };
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: {
      type: String
    }
  },
  mounted() {
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    // 数据校验
    validate() {
      console.log("拿到注入的form", this.form)
      // 规则
      console.log('rules=',this.form.rules[this.prop])
      const rules = this.form.rules[this.prop];
      // 当前值
      console.log('model=',this.form.model[this.prop])
      const value = this.form.model[this.prop];

      // 校验描述对象
      const desc = { [this.prop]: rules };
      // 创建Schema实例
      const schema = new Schema(desc);
      return schema.validate({ [this.prop]: value }, errors => {
        if (errors) {
          this.error = errors[0].message;
        } else {
          // 校验通过
          this.error = "";
        }
      });
    }
  }
};
</script>

<style scoped>
#error{
  color: red;
}
</style>