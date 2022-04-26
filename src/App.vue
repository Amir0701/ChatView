<template>
  <v-app>
    <v-main>
      <v-card
          class="mx-auto overflow-hidden"
          height="100vh"
      >
        <v-app-bar
            color="deep-purple"
            dark
        >
          <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

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

        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
        >
          <v-list
              nav
              dense
          >
            <v-list-item-group
                v-model="group"
                active-class="deep-purple--text text--accent-4"
            >
              <v-list-item :to="'/'">
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>

              <v-list-item :to="'/login'">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Login</v-list-item-title>
              </v-list-item>

              <v-list-item :to="'/foo'">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Not Found</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>

        <v-card-text style="height: 100%">
          <router-view/>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

import store from "@/store"
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants'
import {MUTATIONS} from "@/store/modules/auth/constants";

export default {
  name: 'ChatView',
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`,
      isAuthenticated: `auth/${AUTH_CONSTANTS.GETTERS.IS_AUTHENTICATED}`,
    })
  },
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
  },
  data: () => ({
    drawer: false,
    group: null
  }),
  methods: {
    logout: () => {
      console.log('logout')
      store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.LOGOUT}`)
    }
  }
}
</script>