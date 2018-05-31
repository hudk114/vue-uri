import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/home';
import Page1 from '../pages/page1';
// import Page2 from '../pages/page2';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/page1',
      name: 'page1',
      component: Page1
    },
    // {
    //   path: '/page2',
    //   name: 'page2',
    //   component: Page2
    // }
  ]
});
