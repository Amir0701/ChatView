<template>
  <v-snackbar
      v-model="is_shown"
      :color="color"
      elevation="24"

  >
    {{ message }}
    <v-btn text @click="clear()">Close</v-btn>
  </v-snackbar>
</template>

<script>
import {mapGetters} from "vuex";

import store from "@/store";
import * as SNACKBAR_CONSTANTS from '@/store/modules/snackbar/constants'

export default {
  name: "Snackbar",
  computed: {
    ...mapGetters({
      message: `snackbar/${SNACKBAR_CONSTANTS.GETTERS.MESSAGE}`,
      color: `snackbar/${SNACKBAR_CONSTANTS.GETTERS.COLOR}`,
      timeout: `snackbar/${SNACKBAR_CONSTANTS.GETTERS.TIMEOUT}`,
    }),
    is_shown: {
      get: () => store.getters[`snackbar/${SNACKBAR_CONSTANTS.GETTERS.IS_SHOWN}`],
      set: () => store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, false)
    }
  },
  methods: {
    clear: () => {
      store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, false)
    }
  }
}
</script>