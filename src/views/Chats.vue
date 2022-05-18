<template>
  <v-card
      class="mx-auto overflow-hidden"
      height="100vh"
  >
    <v-app-bar
        color="deep-purple"
        dark
    >

      <v-toolbar-title>Chats</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
          :close-on-content-click="false"
          v-if="token"
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
              <span class="white--text text-h6">{{ userInfo.nickname && userInfo.nickname.length ? userInfo.nickname[0] : '-' }}</span>
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
                <span class="white--text text-h6">{{ userInfo.nickname && userInfo.nickname.length ? userInfo.nickname[0] : '-' }}</span>
              </v-avatar>
              <h3>{{ userInfo.nickname }}</h3>
              <p class="text-caption mt-1">
                {{ userInfo.name }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-list dense class="text-left">
                <v-list-item @click="openDialog">
                  <v-list-item-icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Edit profile</v-list-item-title>
                </v-list-item>

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

    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    label="Name*"
                    v-model="userFormData.name"
                    minlength="1"
                    maxlength="50"
                    :error-messages="errors.name"
                    required
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    label="Nickname"
                    v-model="userFormData.nickname"
                    minlength="1"
                    maxlength="50"
                    :error-messages="errors.nickname"
                    hint="Unique nickname"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Email*"
                    v-model="userFormData.email"
                    minlength="5"
                    maxlength="50"
                    :error-messages="errors.email"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Password*"
                    type="password"
                    v-model="userFormData.password"
                    :error-messages="errors.password"
                    minlength="6"
                    maxlength="50"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Confirm Password*"
                    type="password"
                    v-model="userFormData.confirmPassword"
                    minlength="6"
                    maxlength="50"
                    required
                    :error-messages="errors.confirmPassword"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="editProfile"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text style="height: 100%">
      <p>chats page</p>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

import store from "@/store";
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants';
import {authService} from "@/services";
import * as SNACKBAR_CONSTANTS from "@/store/modules/snackbar/constants";
import {MUTATIONS} from "@/store/modules/auth/constants";

export default {
  name: 'chats',
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`,
      token: `auth/${AUTH_CONSTANTS.GETTERS.TOKEN}`,
    })
  },
  data: () => ({
    dialog: false,
    userFormData: {},
    errors: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  }),
  methods: {
    logout: () => {
      store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.LOGOUT}`)
    },

    openDialog: function() {
      this.dialog = true
      this.userFormData = {...this.userInfo}
    },

    closeDialog: function () {
      this.dialog = false
      this.userFormData = {}
    },

    editProfile: async function () {
      this.errors.name = this.userFormData.name && this.userFormData.name.length > 0 ? '' : 'Name must be non-empty'
      this.errors.nickname = this.userFormData.nickname && this.userFormData.nickname.length > 0 ? '' : 'Nickname must be non-empty'
      this.errors.email = this.userFormData.email && this.userFormData.email.length > 4 ? '' : 'Length of email must be in interval [5, 50]'
      this.errors.password = this.userFormData.password && this.userFormData.password.length > 5 ? '' : 'Length of password must be in interval [6, 50]'
      this.errors.confirmPassword = this.userFormData.confirmPassword && this.userFormData.confirmPassword.length > 5 && this.userFormData.password === this.userFormData.confirmPassword ? '' : 'Passwords doesn\'t match'
      if (Object.values(this.errors).some(err => err !== '')) return

      try {
        // eslint-disable-next-line
        const { confirmPassword, ...toUpdate } = this.userFormData
        const data = await authService.updateProfile(this.userInfo.id, this.token, toUpdate)

        await store.commit(`auth/${MUTATIONS.SET_USER}`, data)

        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'success')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, 'Successfully updated')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
        this.dialog = false
      } catch (err) {
        const errMsg = err.response.data?.exceptions && err.response.data?.exceptions[0].message;

        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg)
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
      }
    }
  },
  async created() {
    if (this.userInfo && this.userInfo.id && this.token)
      await store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.GET_USER_INFO}`, {id: this.userInfo.id, token: this.token})
    else
      this.logout()
  }
}
</script>
