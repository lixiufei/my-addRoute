import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    base:'/',
    routes: [
        {
            path: '/hello',
            component: resolve => require(['@/page/HelloWorld.vue'], resolve)
        },
        // {
        //     path: '/404',
        //     component: resolve => require(['@/page/404.vue'], resolve)
        // },
        // {
        //     path: '/403',
        //     component: resolve => require(['@/page/403.vue'], resolve)
        // },
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ],
    mode:"hash"
})
