import router from './router'
const _import = require('./router/_import') //获取组件的方法
var getRouter //用来获取后台拿到的路由
router.beforeEach((to, from, next) => {
  // const role = localStorage.getItem('token');
  // if (role) { //如果有就直接到首页咯
    if (!getRouter) { //不加这个判断，路由会陷入死循环
      if (!getObjArr('router')) {
        next()
        // axios.post('/admin/api/menu/listAll').then((res) => {
          // getRouter = res.data.data //后台拿到路由
					getRouter = [{
						id: 1,
						name: '首页',
						path: '/hello',
						url: 'page/HelloWorld.vue'
					}]
          routerGo(to, next) //执行路由跳转方法
          saveObjArr('router', getRouter) //存储路由到localStorage
        // })
				
      } else { //从localStorage拿到了路由
        getRouter = getObjArr('router') //拿到路由
        routerGo(to, next)
      }
    } else {
      next()
    }
  // } else {
  //   if (to.path == '/login') { //如果是登录页面路径，就直接next()
  //     next();
  //   } else { //不然就跳转到登录；
  //     next('/login');
  //   }
  // }
})

function routerGo(to, next) {
  let initialRoutes = router.options.routes
  let DynamicRoutes = filterAsyncRouter(getRouter);
  // let newRouter = [...DynamicRoutes]
	let newRouter = [...initialRoutes, ...DynamicRoutes]
  router.options.routes = newRouter
  router.addRoutes(newRouter)
  console.log(router)
  global.antRouter = DynamicRoutes //将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({
    ...to,
    replace: true
  })
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
  localStorage.setItem(name, JSON.stringify(data))
}

function getObjArr(name) { //localStorage 获取数组对象的方法
  return JSON.parse(window.localStorage.getItem(name));

}

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.url) {
      route.count = 0;
      if (route.url === 'Layout') { //Layout组件特殊处理
        route.component = Layout
      } else if (route.url === 'Block') { //Layout组件特殊处理
        route.component = Block
      } else {
				try{route.component = _import(route.url)}
        // try{route.component =  resolve => require(['@/' + route.url], resolve)}
        catch(err){console.log(err)
          route.component = Block
        }
      }
    } else {
      delete route.url
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }

    return true
  })
  return accessedRouters
}
