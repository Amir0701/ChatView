import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/modules/auth'
import chats from '@/store/modules/chats';
import snackbar from '@/store/modules/snackbar';
import stompClient from "@/services/socket";
import createWebSocketPlugin from "@/plugins/websocketStorePlugin";

Vue.use(Vuex)

const wsPlugin = createWebSocketPlugin(stompClient)

export default new Vuex.Store({
  modules: {
    auth,
    snackbar,
    chats
  },
  plugins: [wsPlugin],
})
