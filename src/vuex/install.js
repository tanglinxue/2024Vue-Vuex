export let Vue;
const install = _Vue => {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {//让所有的组件都定义一个$store 属性可以用来获取store实例
      const options = this.$options;
      if (options.store) {
        this.$store = options.store;
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store
      }
    },
  })
}
export default install
