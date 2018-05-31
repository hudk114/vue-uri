/**
 * mixin到需要列表查询的页面中
 * 页面中需要定义
 * @argument {methods} query 查询请求
 * @argument {data} queryData 需要放到query里的数据
 */

import Vue from 'vue';
import { expect } from '@hudk/assert';
// import { throttleMedium } from '@utils/throttle';

export default {
  data () {
    return {
      __$cacheQuery: null,
      m_listCount: 0,
      m_page: 1,
      m_pageSize: 10
    };
  },
  beforeMount () {
    this.__$routeToParams();
    this.query && this.query();
  },
  methods: {
    __$initQueryData () {
      Vue.set(this, 'queryData', this.$options.data().queryData);
      this.$data.__$cacheQuery = null;
    },
    __$formatRoute (obj) {
      const query = this.__$removeEmpty(obj);
      this.$router.push({ query });
    },
    /**
     * 使用__$triggerQuery而非直接在router里直接调用的原因是有些操作不会触发router更新但是也要触发
     */
    // TODO
    __$triggerQuery () {
      // 为了绑定this
      this.query && this.query();
    },
    // __$triggerQuery: throttleMedium(function () {
    //   // 为了绑定this
    //   this.query && this.query();
    // }),
    /**
     * province，city，page与count单独存储，其他放到queryData中
     */
    __$routeToParams () {
      // TODO deep clone
      const query = JSON.parse(JSON.stringify(this.$route.query));

      const p = query.page ? Number(query.page) : this.$options.data().m_page;
      this.m_pageSize = query.pageSize ? Number(query.pageSize) : this.$options.data().m_pageSize;

      // m_listCount can't use computed here
      // 用于防止pagination自动将page变小
      this.m_page !== p && (this.m_listCount = (p + 1) * this.m_pageSize);
      this.m_page = p;

      delete query.page;
      delete query.pageSize;
      Object.assign(this.queryData, query);

      // user params format
      typeof this.formatParams === 'function' && this.formatParams();
    },
    __$fromPageInner: (to, from) => to.name === from.name,
    __$isCurrentPage (to, from) {
      return to.matched.length > 0 &&
        to.matched[to.matched.length - 1].instances.default === this;
    },
    // TODO 比较to的query与本地cache有没有改变
    __$routeNotChangeCache (to) {
      function deepCompare (objA, objB) {
        // TODO 目前不比较奇奇怪怪的情况，只考虑对象与基本值，不考虑数组
        if (typeof objA !== typeof objB) {
          return false;
        }

        // 基本值比较
        if (objA === null || objB === null || typeof objA !== 'object') {
          return objA === objB;
        }

        for (const key in objA) {
          if (objA.hasOwnProperty(key) !== objB.hasOwnProperty(key)) return false;
          if (!deepCompare(objA[key], objB[key])) return false;
        }

        for (const key in objA) {
          if (objA.hasOwnProperty(key) !== objB.hasOwnProperty(key)) return false;
          if (!deepCompare(objA[key], objB[key])) return false;
        }

        return true;
      }

      return deepCompare(this.$data.__$cacheQuery, to.query);
    },
    // 清除obj中value为空的字段
    __$removeEmpty (obj) {
      const o = {};

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const val = obj[key];
          !expect(val).isEmptyOrNull() &&
            (o[key] = val);
        }
      }

      return o;
    },
    // query只改变router，而router的改变会触发真正的查询操作
    handleQuery () {
      this.m_page = 1;
      this.$data.__$cacheQuery = JSON.parse(JSON.stringify(this.queryData));
      this.$data.__$cacheQuery.page = this.m_page;
      this.$data.__$cacheQuery.pageSize = this.m_pageSize;

      // 不挂载空的
      this.$data.__$cacheQuery = this.__$removeEmpty(this.$data.__$cacheQuery);

      const o = JSON.parse(JSON.stringify(this.$data.__$cacheQuery));

      this.__$formatRoute(o);
    },
    keyDown (e) {
      e.keyCode === 13 && this.handleQuery();
    },
    handleCurrentChange (val, pageSize) {
      this.m_page = val || this.m_page;
      this.m_pageSize = pageSize || this.m_pageSize;
      // 只改变部分条件
      this.$data.__$cacheQuery =
        this.$data.__$cacheQuery || JSON.parse(JSON.stringify(this.queryData));
      this.$data.__$cacheQuery.page = this.m_page;
      this.$data.__$cacheQuery.pageSize = this.m_pageSize;

      const o = JSON.parse(JSON.stringify(this.$data.__$cacheQuery));

      this.__$formatRoute(o);
    }
  },
  watch: {
    /**
     * 同一页面内跳转刷新query缓存，否则不刷新
     */
    $route (to, from) {
      // debugger
      if (!this.__$isCurrentPage(to, from)) {
        return;
      }

      // 非同页面跳转使用缓存内的值刷新route
      if (!this.__$fromPageInner(to, from)) {
        // TODO 如果有需要刷新的情况，给一个值（改为需要使用cache的时候不刷新）
        // 只有缓存值更新后才需要重新format
        if (this.$data.__$cacheQuery && !this.__$routeNotChangeCache(to)) {
          this.__$formatRoute(this.$data.__$cacheQuery);
          // 刷新后的$route会再次触发$route更新，这次取消
          return;
        }
      }

      // TODO 如果是主动触发查询的话不需要
      // 同页面内跳转刷新缓存
      this.__$routeToParams();

      // the real query here!
      this.__$triggerQuery();
    }
  }
};
