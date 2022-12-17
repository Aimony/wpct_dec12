// /*
//  * @Author: Your Name you@example.com
//  * @Date: 2021-10-12 20:45:44
//  * @LastEditors: Your Name you@example.com
//  * @LastEditTime: 2022-10-31 10:21:01
//  * @FilePath: \vue\src\store\modules\permission.js
//  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
//  */
// import { constantRoutes, constantRouter } from '@/router/index'

// /**
//  * 判断用户是否拥有此菜单
//  * @param menus
//  * @param route
//  */
// function hasPermission(menus, route) {
//   if (route.menu) {
//     /*
//     * 如果这个路由有menu属性,就需要判断用户是否拥有此menu权限
//     */
//     return menus.indexOf(route.menu) > -1;
//   } else {
//     return true
//   }
// }

// /**
//  * 递归过滤异步路由表，返回符合用户菜单权限的路由表
//  * @param asyncRouterMap
//  * @param menus
//  */
// function filterAsyncRouter(asyncRouter, menus) {
//   const accessedRouters = asyncRouter.filter(route => {
//     //filter,js语法里数组的过滤筛选方法
//     if (hasPermission(menus, route)) {
//       if (route.children && route.children.length) {
//         //如果这个路由下面还有下一级的话,就递归调用
//         route.children = filterAsyncRouter(route.children, menus)
//         //如果过滤一圈后,没有子元素了,这个父级菜单就也不显示了
//         return (route.children && route.children.length)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

// const permission = {
//   state: {
//     routers: constantRouterMap, //本用户所有的路由,包括了固定的路由和下面的addRouters
//     addRouters: [] //本用户的角色赋予的新增的动态路由
//   },
//   mutations: {
//     SET_ROUTERS: (state, routers) => {
//       state.addRouters = routers
//       console.log('连接前')
//       console.log(state.routers)
//       state.routers = constantRouterMap.concat(routers) //将固定路由和新增路由进行合并, 成为本用户最终的全部路由信息
//       console.log(state.routers)
//     }
//   },
//   actions: {
//     GenerateRoutes({ commit }, userPermission) {
//       //生成路由
//       return new Promise(resolve => {
//         const menus = userPermission.menuList;
//         //声明 该角色可用的路由
//         let accessedRouters
//         //筛选出本角色可用的路由
//         accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
//         //执行设置路由的方法
//         console.log(accessedRouters)
//         commit('SET_ROUTERS', accessedRouters)
//         resolve()
//       })
//     }
//   }
// }
// export default permission








/*
 * @Author: Your Name you@example.com
 * @Date: 2021-10-12 20:45:44
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-10-23 21:33:37
 * @FilePath: \vue\src\store\modules\permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { asyncRouterMap, constantRouterMap } from '@/router/index'

/**
 * 判断用户是否拥有此菜单
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.menu) {
    /*
    * 如果这个路由有menu属性,就需要判断用户是否拥有此menu权限
    */
    // console.log(menus)
    return menus.indexOf(route.menu) > -1;
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户菜单权限的路由表
 * @param asyncRouterMap
 * @param menus
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    //filter,js语法里数组的过滤筛选方法
    let menuArr = []
    menus.forEach(element => {
      menuArr.push(element.menuCode)
    });
    if (hasPermission(menuArr, route)) {
      // console.log('判断')
      if (route.children && route.children.length) {
        //如果这个路由下面还有下一级的话,就递归调用
        route.children = filterAsyncRouter(route.children, menus)
        //如果过滤一圈后,没有子元素了,这个父级菜单就也不显示了
        return (route.children && route.children.length)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap, //本用户所有的路由,包括了固定的路由和下面的addRouters
    addRouters: [] //本用户的角色赋予的新增的动态路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      //将固定路由和新增路由进行合并, 成为本用户最终的全部路由信息
    }
  },
  actions: {
    GenerateRoutes({ commit }, userPermission) {
      //生成路由
      return new Promise(resolve => {
        const menus = userPermission;
        //menu是一个对象 我收到的objec
        // console.log("menus")
        // console.log(menus)
        //声明 该角色可用的路由
        let accessedRouters
        //筛选出本角色可用的路由
        accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        //执行设置路由的方法
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}
export default permission
