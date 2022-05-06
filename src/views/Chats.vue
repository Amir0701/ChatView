<template>
  <v-card
      class="mx-auto overflow-hidden"
      height="100vh"
  >
    <v-app-bar
        color="deep-purple"
        dark
    >

      <v-toolbar-title>Title: {{ isAuthenticated }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
          :close-on-content-click="false"
          v-if="isAuthenticated"
      >
        <template v-slot:activator="{ on }">
          <v-btn
              icon
              v-on="on"
          >
            <v-avatar
                color="brown"
                size="38"
            >
              <span class="white--text text-h6">{{ userInfo.fullName && userInfo.fullName.length ? userInfo.fullName[0] : '-' }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                  color="brown"
                  size="38"
              >
                <span class="white--text text-h6">{{ userInfo.fullName && userInfo.fullName.length ? userInfo.fullName[0] : '-' }}</span>
              </v-avatar>
              <h3>{{ userInfo.fullName }}</h3>
              <p class="text-caption mt-1">
                {{ userInfo.username }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-list dense>
                <v-list-item @click="logout">
                  <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-card-text style="height: 100%">
      <p>chats page</p>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

import store from "@/store";
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants';

export default {
  name: 'chats',
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`,
      isAuthenticated: `auth/${AUTH_CONSTANTS.GETTERS.IS_AUTHENTICATED}`,
    })
  },
  data: () => ({
    group: null
  }),
  methods: {
    logout: () => {
      store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.LOGOUT}`)
    }
  }
}
</script>
