<template>
  <div id="app">
    数量 {{ count }} 我的年龄{{ $store.state.age }}<br />
    爸爸的年龄{{ $store.getters.myAge }}<br />
    爸爸的年龄{{ $store.getters.myAge }}<br />
    爸爸的年龄{{ $store.getters.myAge }}<br />
    爸爸的年龄{{ $store.getters.myAge }}<br />
    <button @click="$store.commit('a/add', 3)">调用mutation</button>
    <button @click="$store.commit('a/d/add', 3)">调用mutation</button>
    <button @click="add(123)">调用最外层action</button>
    <button @click="$store.state.age++">修改</button>

    <div>a模块</div>
    a的年龄是:{{ $store.state.a.age }} <br />
    a的计算属性:{{ $store.getters['a/myAge'] }}
    <div>c模块</div>
    c的年龄是:{{ $store.state.c.age }} <br />
    c的计算属性:{{ $store.getters['myAgec'] }}

    d的年龄是:{{ $store.state.a.d.age }}

    f的年龄是:{{ $store.state.a.f.age }} f的 getter{{
      $store.getters['a/f/cAgec']
    }}
    <button @click="$store.commit('a/f/add')">修改</button>
  </div>
</template>
<script>
function mapState(stateList) {
  let obj = {};
  for (let i = 0; i < stateList.length; i++) {
    let stateKey = stateList[i];
    obj[stateKey] = function () {
      return this.$store.state[stateKey];
    };
  }
  console.log(obj);
  console.log('dsd ');
  return obj;
}
function mapActions(actionList) {
  let obj = {};
  for (let i = 0; i < actionList.length; i++) {
    let actionKey = actionList[i];
    obj[actionKey] = function (payload) {
      return this.$store.dispatch(actionKey, payload);
    };
  }

  return obj;
}
export default {
  mounted() {
    console.log(this.$store);
  },
  methods: {
    ...mapActions(['add']),
    actionAdd() {
      this.$store.dispatch('add', 5).then((res) => {
        console.log(res);
      });
    },
  },
  computed: {
    ...mapState(['count']),
    // count() {
    //   console.log('数量');
    //   console.log(this.$store);
    //   return this.$store.state['count'];
    // },
  },
};
</script>

<style></style>
