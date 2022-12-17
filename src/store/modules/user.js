/*
 * @Author: Your Name you@example.com
 * @Date: 2021-11-18 23:21:54
 * @LastEditors: Your Name you@example.com
 * @LastEditTime: 2022-12-16 10:36:20
 * @FilePath: \vue-admin-template-master\src\store\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '../../store/index'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    count: 0,
    promissions: '',
    localProm: '',
    mykeys: '',
    user: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER: (state, value) => {
    state.user = value
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PROMISSION: (state, promission) => {
    state.promissions = promission
  },
  SET_LOCAL_PROMISSION: (state, promission) => {
    state.mykeys = promission
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.data1.token)
        commit('SET_PROMISSION', data.data1.permissions)
        commit('SET_LOCAL_PROMISSION', data.data1.token + 'promisssion')
        commit('SET_USER', data.user)
        // let keys=data.data1.token+'promission'
        setToken(data.data1.token)
        window.localStorage.setItem('promisssion', data.data1.permissions)
        // if (!res.success) {
        //   this.$message({
        //     message: data.msg1,
        //     type: 'error'
        //   })
        // }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        // console.log(response)
        const { data } = response
        // console.log(data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { roleId, roleName } = data.data[0]
        commit('SET_NAME', roleName)
        commit('SET_AVATAR', roleName)
        store.dispatch('GenerateRoutes', data.data[0].menus).then(() => {
          //生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
          state.count++
          if (state.count == 1) {
            router.addRoutes(store.getters.addRouters)
          }
          // console.log(store.getters.addRouters)
        })
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('RESET_STATE')
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      // resetRouter()
      //   commit('RESET_STATE')
      resolve()
    }).catch(error => {
      reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

