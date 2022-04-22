<template>
  <div>{{ userInfo }}</div>
  <router-view/>
</template>

<script>
import { onMounted } from 'vue';
import { mapGetters } from "vuex";

import store from "@/store"
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants'

export default {
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`
    })
  },
  setup: () => {
    onMounted(() => {
      // for debug store in dev mode
      if (process.env.NODE_ENV === 'development') document.$store = store;

      const token = localStorage.getItem(AUTH_CONSTANTS.LOCALSTORAGE_KEY)

      if (token) store.commit(`auth/${AUTH_CONSTANTS.MUTATIONS.SET_TOKEN}`, token)
    })
  }
}
</script>