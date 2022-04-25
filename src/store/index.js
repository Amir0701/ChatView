import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  /*state: {
    list: []
  },
  getters: {
  },
  mutations: {
    'ADD_USER'(state, user){
      state.list.push(user);
    },
    'DELETE_USER'(state, user){
      const index = state.list.findIndex(item => item.id === user.id);
      state.list.slice(index, 1);
    },
    'EDIT_USER'(state, user){
      const item = state.list.find(item => item.id === user.id);
      Object.assign(item, user)
    }
  },
  actions: {

    async addUser(context, user){
      try {
        const response = await Api.user.add(user);
        context.commit("ADD_USER", response.data);
      }catch (e) {

      }
    },

    async deleteUser(context, id){
      try {
        const response = await Api.user.delete(id)
        context.commit("DELETE_USER", response.data)
      }catch (e) {

      }
    },

    async editUser(context, user){
      try {
        const response = await Api.user.edit(user.id, user);
        context.commit("EDIT_USER", response.data);
      }catch (e) {
        
      }
    }
  },*/
  modules: {
    auth
  }
})
