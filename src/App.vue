<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <div>{{ userInfo }}</div>
  <router-view/>
  </nav>
</template>

<script>
import { onMounted } from 'vue';
import { mapGetters } from "vuex";

import store from "@/store"
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants'

document.$store = store

export default {
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`
    })
  },
  setup: () => {
    onMounted(() => {
      const data = localStorage.getItem(AUTH_CONSTANTS.LOCALSTORAGE_KEY)

      console.log(store)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          store.commit(`auth/${AUTH_CONSTANTS.MUTATIONS.SET_USER}`, parsed)
        } catch (ignore) {
          console.log(`error while parsing JSON: ${data}`)
        }
      }
    })
  }
}
</script>