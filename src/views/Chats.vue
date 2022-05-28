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
              <span class="white--text text-h6">{{
                  userInfo.nickname && userInfo.nickname.length ? userInfo.nickname[0] : '-'
                }}</span>
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
                <span class="white--text text-h6">{{
                    userInfo.nickname && userInfo.nickname.length ? userInfo.nickname[0] : '-'
                  }}</span>
              </v-avatar>
              <h3>{{ userInfo.nickname }}</h3>
              <p class="text-caption mt-1">
                {{ userInfo.name }}
              </p>
              <v-divider class="my-3"></v-divider>

              <v-list dense class="text-left">
                <v-list-item @click="openProfileDialog">
                  <v-list-item-icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Edit profile</v-list-item-title>
                </v-list-item>

                <v-list-item @click="logout">
                  <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="red--text">Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-dialog
        v-model="profileDialog.isOpen"
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
                    v-model="profileDialog.userFormData.name"
                    minlength="1"
                    maxlength="50"
                    :error-messages="profileDialog.errors.name"
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
                    v-model="profileDialog.userFormData.nickname"
                    minlength="1"
                    maxlength="50"
                    :error-messages="profileDialog.errors.nickname"
                    hint="Unique nickname"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Email*"
                    v-model="profileDialog.userFormData.email"
                    minlength="5"
                    maxlength="50"
                    :error-messages="profileDialog.errors.email"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Password*"
                    type="password"
                    v-model="profileDialog.userFormData.password"
                    :error-messages="profileDialog.errors.password"
                    minlength="6"
                    maxlength="50"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Confirm Password*"
                    type="password"
                    v-model="profileDialog.userFormData.confirmPassword"
                    minlength="6"
                    maxlength="50"
                    required
                    :error-messages="profileDialog.errors.confirmPassword"
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
              @click="closeProfileDialog"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              :disabled="profileDialog.loading"
              @click="editProfile"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-text style="height: 100%" class="pa-1">
      <v-container
          class="fill-height pa-0 "
          fluid
      >
        <v-row class="no-gutters elevation-4 fill-height">
          <ChatList/>
          <Chat/>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

import store from "@/store";
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants';
import * as SNACKBAR_CONSTANTS from "@/store/modules/snackbar/constants";
import * as CHATS_CONSTANTS from "@/store/modules/chats/constants";
import {authService} from "@/services";

import ChatList from "@/components/ChatList";
import Chat from "@/components/Chat";

export default {
  name: 'chats',
  components: {Chat, ChatList},
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`,
      token: `auth/${AUTH_CONSTANTS.GETTERS.TOKEN}`,
    })
  },
  data: () => ({
    profileDialog: {
      isOpen: false,
      userFormData: {},
      errors: {
        name: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loading: false
    },
  }),
  methods: {
    logout: () => {
      store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.LOGOUT}`)
    },

    openProfileDialog: function () {
      this.profileDialog.isOpen = true
      this.profileDialog.loading = false
      this.profileDialog.userFormData = {...this.userInfo}
    },

    closeProfileDialog: function () {
      this.profileDialog.isOpen = false
      this.profileDialog.loading = false
      this.profileDialog.userFormData = {}
    },

    editProfile: async function () {
      this.profileDialog.errors.name = this.profileDialog.userFormData.name && this.profileDialog.userFormData.name.length > 0 ? '' : 'Name must be non-empty'
      this.profileDialog.errors.nickname = this.profileDialog.userFormData.nickname && this.profileDialog.userFormData.nickname.length > 0 ? '' : 'Nickname must be non-empty'
      this.profileDialog.errors.email = this.profileDialog.userFormData.email && this.profileDialog.userFormData.email.length > 4 ? '' : 'Length of email must be in interval [5, 50]'
      this.profileDialog.errors.password = this.profileDialog.userFormData.password && this.profileDialog.userFormData.password.length > 5 ? '' : 'Length of password must be in interval [6, 50]'
      this.profileDialog.errors.confirmPassword = this.profileDialog.userFormData.confirmPassword && this.profileDialog.userFormData.confirmPassword.length > 5 && this.profileDialog.userFormData.password === this.profileDialog.userFormData.confirmPassword ? '' : 'Passwords doesn\'t match'
      if (Object.values(this.profileDialog.errors).some(err => err !== '')) return

      try {
        this.profileDialog.loading = true

        // eslint-disable-next-line
        const {confirmPassword, ...toUpdate} = this.profileDialog.userFormData
        const data = await authService.updateProfile(this.userInfo.id, this.token, toUpdate)

        await store.commit(`auth/${AUTH_CONSTANTS.MUTATIONS.SET_USER}`, data)

        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'success')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, 'Successfully updated')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
        this.profileDialog.isOpen = false
      } catch (err) {
        const errMsg = err.response?.data?.exceptions && err.response?.data?.exceptions[0].message || 'Internal error';

        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg)
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
      }
      this.profileDialog.loading = false
    },
  },
  async created() {
    if (this.userInfo && this.userInfo.id && this.token) {
      await store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.GET_USER_INFO}`, {id: this.userInfo.id, token: this.token})
      await store.dispatch(`chats/${CHATS_CONSTANTS.ACTIONS.GET_CHATS}`, {userId: this.userInfo.id, token: this.token})
    } else
      this.logout()
  }
}
</script>
