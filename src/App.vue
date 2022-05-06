<template>
  <v-app>
    <v-main>
      <Snackbar></Snackbar>
      <transition name="scale" mode="out-in">
        <router-view/>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import store from "@/store"
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants'
import {MUTATIONS} from "@/store/modules/auth/constants";
import Snackbar from "@/components/Snackbar";

export default {
  name: 'ChatView',
  components: {Snackbar},
  beforeCreate() {
    // for debug store in dev mode
    if (process.env.NODE_ENV === 'development') document.$store = store;

    const token = localStorage.getItem(AUTH_CONSTANTS.LOCALSTORAGE_KEY)

    if (token) {
      store.commit(`auth/${AUTH_CONSTANTS.MUTATIONS.SET_TOKEN}`, token)
      store.commit(`auth/${MUTATIONS.SET_USER}`, {
        username: 'JohnDoe',
        fullName: 'John Doe'
      })
    }
  }
}
</script>

<style>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s ease;
}


.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>