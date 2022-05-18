import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/modules/auth'
import chats from '@/store/modules/chats';
import snackbar from '@/store/modules/snackbar';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    snackbar,
    chats
  }
})
