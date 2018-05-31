<template>
  <div>
    <section style="text-align: left;">
      <div>
        <header>输入你想挂载到route页面的值</header>
        <section>
          <ol>
            <li style="display: block;">page与pageSize会自动挂载到page中</li>
            <li style="display: block;">key是必填项</li>
            <!-- <li style="display: block;"></li> -->
          </ol>
        </section>
        <template>
          <div v-for="(item, index) in paramsList" :key="index" style="margin: 10px 0;">
            <el-input style="width: 100px;" v-model="item.key" placeholder="key"></el-input>
            <el-input style="width: 100px;" v-model="item.value" placeholder="value"></el-input>
            <button @click="minus(index)">-</button>
          </div>
        </template>
        <button @click="add">+</button>
      </div>
      <!-- <div>
        <el-checkbox v-model="cache">use cache</el-checkbox>
      </div> -->
      <button @click="toRoute">toRoute</button>
      <button @click="toPage1">toPage1</button>
    </section>
  </div>
</template>

<script>
import { query } from '../../../src/index';
import { expect } from '@hudk/assert';

export default {
  data () {
    return {
      cache: false,
      paramsList: [],
      queryData: {}
    };
  },
  methods: {
    judge (list) {
      list.forEach(item => {
        if (expect(item.key).isEmptyOrNull()) throw new TypeError('key必须存在');
      });
    },
    toRoute () {
      try {
        this.judge(this.paramsList);
      } catch (error) {
        alert(error);
      }

      this.queryData = {};
      this.paramsList.forEach(item => {
        this.queryData[item.key] = item.value;
      });

      this.handleQuery();
    },
    toPage1 () {
      this.$data.__$cacheQuery
      this.$router.push({
        name: 'page1',
        params: JSON.parse(JSON.stringify(this.$data.__$cacheQuery))
      });
    },
    add () {
      this.paramsList.push({
        key: '',
        value: ''
      });
    },
    minus (index) {
      this.paramsList.splice(index, 1);
    },
    query () {
      console.log(this.$data.__$cacheQuery)
      console.log(this.queryData);
    }
  },
  mixins: [query]
};
</script>
