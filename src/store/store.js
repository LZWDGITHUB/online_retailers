import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
    username: ''
}
const mutations = {
    setUsername: (state, username) => {
        state.username = username
        localStorage.setItem('username',username)
    }
}
const actions = {}
const getters = {
    //eslint disable next line
    username: ()=>localStorage.getItem('username')
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})