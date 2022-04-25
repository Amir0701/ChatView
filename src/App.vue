<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

import store from "@/store"
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants'

export default {
  name: 'ChatView',
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`
    })
  },
  created() {
    // for debug store in dev mode
    if (process.env.NODE_ENV === 'development') document.$store = store;
  }
}
</script>