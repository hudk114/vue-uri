<template>
  <section style="text-align: left;">
      <div>
        <!-- <header>之前缓存的值是</header> -->
        <section>
          <ol>
            <li style="display: block;">选中 使用cache，则会用cache返回到home页， 否则值不一样</li>
            <!-- <li style="display: block;">key是必填项</li> -->
            <!-- <li style="display: block;"></li> -->
          </ol>
        </section>
      </div>
      <div>
        <el-checkbox v-model="cache">use cache</el-checkbox>
      </div>
      <button @click="seeCache">seeCache</button>
      <button @click="toHome">toHome</button>
    </section> 
</template>

<script>
export default {
  activated () {
    console.log(this.$route.params);
  },
  data () {
    return {
      cache: false
    };
  },
  methods: {
    seeCache () {
      console.log(this.$route.params);
    },
    toHome () {
      this.$router.push({
        name: 'home',
        query: this.cache ? JSON.parse(JSON.stringify(this.$route.params)) : {}
      });
    }
  }
};
</script>
