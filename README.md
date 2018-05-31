# vue-uri
easy query uri import for vue &amp; vue-router

# usage
1. 项目中需使用vue2.x及对应的vue-router

      ```bash
      npm install @hudk/vue-uri
      ```

1. 引入
    * 全局引入
      ```js
      import { query } from '@hudk/vue-uri';
      Vue.mixin(query);
      ```
    * 组件引入
      ```js
      import { query } from '@hudk/vue-uri';
    
      Vue.extends({
        mixins: [query]
      });
      ```
1. 使用
    
    * 在组件的data中定义{Object}queryData，用于存放需要放到uri中的数据；在methods中定义query方法，用于发起真正的请求
    
    * 在需要发起请求的地方，调用handleQuery方法，方法会将queryData放到uri上并自动存储一次

    * 对于翻页和回车查询这两类在query中常用的操作，`vue-uri` 提供了两个方法：对于回车查询，对需要触发回车自动查询的属性绑定 `DOMElement.onkeyDown = this.keyDown` ；对换页查询，换页后直接触发`handleCurrentChange(page, pageSize)`，page与pageSize会默认被加到query中，可通过 `this.m_page` 与 `this.m_pageSize` 两个属性获取这两个值

# 跳页逻辑

# 注意
1. 空值不会被挂载到router中，也不会用作跳页逻辑中的逻辑比较，应当给一个其他值（比如' '）
