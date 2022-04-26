<template>
  <div class="login mt-4">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                    prepend-icon="mdi-account"
                    name="login"
                    label="Login"
                    type="text"
                ></v-text-field>
                <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import * as AUTH_CONSTANTS from "@/store/modules/auth/constants";
import router from "@/router";
import {MUTATIONS} from "@/store/modules/auth/constants";
import store from "@/store";

export default {
  name: 'login',
  methods: {
    login: async () => {
      const token = 'token_from_login'
      const user = {
        username: 'JohnDoe',
        fullName: 'John Doe'
      }
      localStorage.setItem(AUTH_CONSTANTS.LOCALSTORAGE_KEY, token)
      await store.commit(`auth/${MUTATIONS.SET_TOKEN}`, token)
      await store.commit(`auth/${MUTATIONS.SET_USER}`, user)
      await router.push({path: '/'})
    }
  }
}
</script>