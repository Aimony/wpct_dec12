import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '首页', icon: 'dashboard' }
  //   }]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/userlist',
    name: '用户列表',
    children: [
      {
        path: 'userList',
        name: 'userList',
        component: () => import('@/views/userList/index'),
        meta: { title: '用户列表', icon: 'form' }
      }
    ]
  },
  {
    path: '/wxuser',
    component: Layout,
    name: '微信用户权限',
    children: [
      {
        path: 'wxuser',
        name: 'wxuser',
        component: () => import('@/views/WxUser/index'),
        meta: { title: '微信用户列表', icon: 'form' }
      }
    ]
  },
  {
    path: '/suggestion',
    component: Layout,
    name: '意见管理',
    children: [
      {
        path: 'suggestion',
        name: 'suggestion',
        component: () => import('@/views/suggestion/index'),
        meta: { title: '意见管理', icon: 'form' }
      }
    ]
  },
  // {
  //   path: '/deposit',
  //   component: Layout,
  //   name: '押金管理',
  //   children: [
  //     {
  //       path: 'pay',
  //       name: 'property',
  //       component: () => import('@/views/deposit/index'),
  //       meta: { title: '押金管理', icon: 'form' }
  //     }
  //   ]
  // },
  {
    path: '/buildInfo',
    component: Layout,
    name: '房屋信息管理',
    children: [
      {
        path: 'buildInfo',
        name: 'BuildInfo',
        component: () => import('@/views/buildInfo/index'),
        meta: { title: '房屋信息管理', icon: 'tree' }
      },
    ]
  },
  {
    path: '/bill',
    component: Layout,
    name: '账单管理',
    children: [
      {
        path: 'bill',
        name: 'bill',
        component: () => import('@/views/bill/index'),
        meta: { title: '账单管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/pool',
    component: Layout,
    name: '公摊费',
    meta: { title: '公摊费管理', icon: 'form' },
    children: [
      {
        name: 'Water',
        path: 'water',
        component: () => import('@/views/pool/water/index.vue'),
        meta: { title: '水费', icon: 'tree' }
      }, {
        name: 'Lift',
        path: 'lift',
        component: () => import('@/views/pool/lift/index.vue'),
        meta: { title: '电梯费', icon: 'tree' }
      }, {
        name: 'Electricity',
        path: 'electricity',
        meta: { title: '电费', icon: 'tree' },
        component: () => import('@/views/pool/electricity/index.vue')
      }]
  },

  {
    path: '/role',
    component: Layout,
    name: '用户权限',
    children: [
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/role/index'),
        meta: { title: '用户权限', icon: 'form' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    hidden: true, // 不显示到左侧菜单
    children: [{
      path: '',
      component: () => import('@/views/excel')
    }]
  },


  // {
  //   path: '/pool',
  //   name: 'Pool',
  //   meta: { title: '公摊费管理', icon: 'tree' },
  //   component: () => import('@/views/pool/index.vue'),
  //   children: [{
  //     name: 'Water',
  //     path: 'water',
  //     component: () => import('@/views/pool/water/index.vue'),
  //     meta: { title: '水费', icon: 'tree' }
  //   }, {
  //     name: 'Lift',
  //     path: 'lift',
  //     component: () => import('@/views/pool/lift/index.vue'),
  //     meta: { title: '电梯费', icon: 'tree' }
  //   }, {
  //     name: 'Electricity',
  //     path: 'electricity',
  //     meta: { title: '电费', icon: 'tree' },
  //     component: () => import('@/views/pool/electricity/index.vue')
  //   }]
  // },



  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


// export const asyncRouterMap = [
//   {
//     path: '/example',
//     component: Layout,
//     redirect: '/example/table',
//     name: 'Example',
//     meta: { title: 'Example', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'table',
//         name: 'Table',
//         component: () => import('@/views/table/index'),
//         meta: { title: 'Table', icon: 'table' }
//       },
//       {
//         path: 'tree',
//         name: 'Tree',
//         component: () => import('@/views/tree/index'),
//         meta: { title: 'Tree', icon: 'tree' }
//       }
//     ]
//   },

//   {
//     path: '/form',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: 'Form',
//         component: () => import('@/views/form/index'),
//         meta: { title: 'Form', icon: 'form' }
//       }
//     ]
//   },





// ]

// const createRouter = () => new Router({
//   // mode: 'history', // require service support
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRoutes
// })
// const router = createRouter()
// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }



// export default router



export const asyncRouterMap = [
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/',
  //   name: '功能模块',
  //   meta: { title: '功能模块', icon: 'tree' },
  //   children: [

  //     {
  //       path: 'zujin',
  //       name: '缴费管理',
  //       // component: _import('zujin/zujin'),
  //       meta: { title: '缴费管理', icon: 'example' },
  //       menu: 'zujin'
  //     },
  //     {
  //       path: 'money',
  //       name: '物业管理',
  //       // component: _import('suggestion/index'),//money
  //       meta: { title: '物业管理', icon: 'example' },
  //       menu: 'money'
  //     },
  //     {
  //       path: 'suggestion',
  //       name: '意见管理',
  //       // component: _import('suggestion/index'),
  //       meta: { title: '意见管理', icon: 'example' },
  //       menu: 'suggestion'
  //     },
  //     {
  //       path: 'shenpi',
  //       name: '审批管理',
  //       // component: _import('shenpi/shenpi'),
  //       meta: { title: '审批管理', icon: 'example' },
  //       menu: 'shenpi'
  //     },
  //     {
  //       path: 'weixin',
  //       name: '微信用户管理',
  //       // component: _import('weixin/weixin'),
  //       meta: { title: '微信用户管理', icon: 'password' },
  //       menu: 'weixin'
  //     },
  // {
  //   path: 'bill',
  //   name: '账单管理',

  //   component: () => import('../views/bill/index'),
  //   meta: { title: '账单', icon: 'example' },
  //   menu: 'bill'
  // }
  // {
  //   path: '/bill',
  //   component: Layout,
  //   name: '账单管理',
  //   children: [
  //     {
  //       path: 'bill',
  //       name: 'bill',
  //       component: () => import('@/views/bill/index'),
  //       meta: { title: '账单管理', icon: 'form' }
  //     }
  //   ]
  // },
  // ]
  //   },
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user',
  //   name: '',
  //   meta: { title: '用户权限', icon: 'table' },
  //   children: [
  //     {
  //       path: '', name: '用户列表',
  //       // component: _import('user/user'), 
  //       meta: { title: '用户列表', icon: 'user' }, menu: 'user'
  //     },
  //     {
  //       path: 'role',
  //       name: '权限管理',
  //       // component: _import('user/role'),
  //       meta: { title: '权限管理', icon: 'password' },
  //       menu: 'role'
  //     },
  //   ]
  // },
  // { path: '*', redirect: '/404', hidden: true }
]
