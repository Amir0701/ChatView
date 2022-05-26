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
                <v-list-item @click="openChatDialog">
                  <v-list-item-icon>
                    <v-icon>mdi-forum</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Create Chat</v-list-item-title>
                </v-list-item>

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
                  <v-list-item-title>Logout</v-list-item-title>
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

    <v-dialog
        v-model="createChatDialog.isOpen"
        persistent
        max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Create Chat</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
              >
                <v-text-field
                    label="Chat name"
                    v-model="createChatDialog.chatFormData.name"
                    minlength="1"
                    :error-messages="createChatDialog.errors.name"
                    required
                ></v-text-field>
              </v-col>

              <v-col
                  cols="12"
              >
                <v-autocomplete
                    v-model="createChatDialog.participants"
                    :loading="createChatDialog.loading"
                    :items="createChatDialog.users"
                    :search-input.sync="createChatDialog.search"
                    cache-items
                    dense
                    chips
                    clearable
                    deletable-chips
                    small-chips
                    multiple
                    flat
                    hide-no-data
                    hide-details
                    item-text="name"
                    return-object
                    color="lighten"
                    label="Chat participants:"
                >
                  <template v-slot:selection="data">
                    <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="remove(data.item)"
                    >
                      <v-avatar left>
                        <v-img :src="data.item.avatar"></v-img>
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>

                  <template v-slot:item="data">
                    <template>
                      <v-list-item-avatar>
                        <img :src="data.item.avatar">
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                        <v-list-item-subtitle v-html="data.item.nickname"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="closeChatDialog"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              :disabled="createChatDialog.loading"
              @click="createChat"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text style="height: 100%" class="pa-1">
      <div class="chat_content">
        <v-card>
          <v-card-title class="white--text">
            <v-row>
              <v-col cols="10" class="pa-1">
                <v-text-field
                    label="Search"
                    single-line
                    solo
                    hide-details
                    clearable
                    v-model="searchBoxQuery"
                    prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="pa-1 d-flex justify-center align-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="white"
                        class="text--primary"
                        fab
                        small
                        @click="openChatDialog"
                        v-bind="attrs"
                        v-on="on"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Create Chat</span>
                </v-tooltip>
              </v-col>
            </v-row>

          </v-card-title>

          <v-divider></v-divider>

          <v-virtual-scroll
              :items="getChatsList()"
              :item-height="50"
              height="calc(100vh - 145px)"
          >
            <template v-slot:default="{ item }">
              <v-list-item>
                <v-list-item-avatar>
                  <v-avatar
                      :color="getRandomColor()"
                      size="56"
                      class="white--text"
                  >
                    {{ item.name[item.name.length - 1] }}
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-menu
                      transition="slide-y-transition"
                      bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          color="white"
                          class="text--primary"
                          small
                          fab
                          icon
                          v-bind="attrs"
                          v-on="on"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense rounded>
                      <v-list-item @click="deleteChat(item.id)">
                        <v-list-item-title>Delete chat</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

import store from "@/store";
import * as AUTH_CONSTANTS from '@/store/modules/auth/constants';
import * as SNACKBAR_CONSTANTS from "@/store/modules/snackbar/constants";
import * as CHATS_CONSTANTS from "@/store/modules/chats/constants";
import {authService, chatsService} from "@/services";

export default {
  name: 'chats',
  computed: {
    ...mapGetters({
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`,
      token: `auth/${AUTH_CONSTANTS.GETTERS.TOKEN}`,
      chats: `chats/${CHATS_CONSTANTS.GETTERS.CHATS}`
    })
  },
  data: () => ({
    searchBoxQuery: '',
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
    createChatDialog: {
      isOpen: false,
      chatFormData: {
        name: '',

      },
      errors: {
        name: '',
      },
      loading: false,
      users: [],
      search: '',
      participants: [],
      timerId: null,
    },
    colors: ['#2196F3', '#90CAF9', '#64B5F6', '#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF'],
  }),
  watch: {
    'createChatDialog.search': function(val) {
      val && val !== this.createChatDialog.participants && this.fetchUsersDebounce(val)
    },
  },
  methods: {
    fetchUsersDebounce: function(pattern, timeMS = 500) {
      clearTimeout(this.createChatDialog.timerId)

      this.createChatDialog.timerId = setTimeout(() => {
        this.querySearchUsers(pattern)
      }, timeMS)
    },

    querySearchUsers: async function(pattern) {
      if (this.createChatDialog.loading) return

      this.createChatDialog.loading = true
      try {
        const data = await authService.getUsersLike(pattern, this.token)

        this.createChatDialog.users.splice(0, this.createChatDialog.users.length, ...data)
      } catch (err) {
        const errMsg = err.response?.data?.exceptions && err.response?.data?.exceptions[0].message || 'Internal error';

        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg)
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
      }
      this.createChatDialog.loading = false
    },

    remove: function(item) {
      const index = this.createChatDialog.participants.findIndex(participant => participant.name === item.name && participant.nickname === item.nickname)
      if (index >= 0) this.createChatDialog.participants.splice(index, 1)
    },

    getChatsList: function() {
      return (this.searchBoxQuery || '').trim()
      ? this.chats.filter(chat => chat.name.includes(this.searchBoxQuery))
      : this.chats
    },

    deleteChat: async function(chatId) {
      await store.dispatch(`chats/${CHATS_CONSTANTS.ACTIONS.DELETE_CHAT}`, {token: this.token, chatId})
    },

    getRandomColor: function() {
      return this.colors[Math.ceil(Math.random() * (this.colors.length - 1))]
    },

    logout: () => {
      store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.LOGOUT}`)
    },

    openProfileDialog: function() {
      this.profileDialog.isOpen = true
      this.profileDialog.loading = false
      this.profileDialog.userFormData = {...this.userInfo}
    },

    closeProfileDialog: function () {
      this.profileDialog.isOpen = false
      this.profileDialog.loading = false
      this.profileDialog.userFormData = {}
    },

    editProfile: async function() {
      this.profileDialog.errors.name = this.profileDialog.userFormData.name && this.profileDialog.userFormData.name.length > 0 ? '' : 'Name must be non-empty'
      this.profileDialog.errors.nickname = this.profileDialog.userFormData.nickname && this.profileDialog.userFormData.nickname.length > 0 ? '' : 'Nickname must be non-empty'
      this.profileDialog.errors.email = this.profileDialog.userFormData.email && this.profileDialog.userFormData.email.length > 4 ? '' : 'Length of email must be in interval [5, 50]'
      this.profileDialog.errors.password = this.profileDialog.userFormData.password && this.profileDialog.userFormData.password.length > 5 ? '' : 'Length of password must be in interval [6, 50]'
      this.profileDialog.errors.confirmPassword = this.profileDialog.userFormData.confirmPassword && this.profileDialog.userFormData.confirmPassword.length > 5 && this.profileDialog.userFormData.password === this.profileDialog.userFormData.confirmPassword ? '' : 'Passwords doesn\'t match'
      if (Object.values(this.profileDialog.errors).some(err => err !== '')) return

      try {
        this.profileDialog.loading = true

        // eslint-disable-next-line
        const { confirmPassword, ...toUpdate } = this.profileDialog.userFormData
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

    openChatDialog: function() {
      this.createChatDialog.isOpen = true
      this.createChatDialog.loading = false
      this.createChatDialog.chatFormData = {}
      this.querySearchUsers('')
    },

    closeChatDialog: function () {
      this.createChatDialog.isOpen = false
      this.createChatDialog.loading = false
      this.createChatDialog.chatFormData = {}
      this.createChatDialog.participants = []
      this.createChatDialog.search = ''
    },

    createChat: async function() {
      this.createChatDialog.errors.name = this.createChatDialog.chatFormData.name && this.createChatDialog.chatFormData.name.length > 0 ? '' : 'Name must be non-empty'
      if (Object.values(this.createChatDialog.errors).some(err => err !== '')) return

      this.createChatDialog.loading = true
      try {
        const data = await chatsService.createChat(this.token, this.createChatDialog.chatFormData)

        store.commit(`chats/${CHATS_CONSTANTS.MUTATIONS.ADD_CHATS}`, [data])

        await chatsService.addUsersToChat(data.id, this.createChatDialog.participants, this.token)

        this.createChatDialog.isOpen = false
      } catch (err) {
        const errMsg = err.response?.data?.exceptions && err.response?.data?.exceptions[0].message || 'Internal error';

        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg)
        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
      }
      this.createChatDialog.loading = false
    }
  },
  async created() {
    if (this.userInfo && this.userInfo.id && this.token) {
      await store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.GET_USER_INFO}`, {id: this.userInfo.id, token: this.token})
      await store.dispatch(`chats/${CHATS_CONSTANTS.ACTIONS.GET_CHATS}`, {userId: this.userInfo.id, token: this.token})
    }
    else
      this.logout()
  }
}
</script>

<style>
.chat_content {
  display: grid;
  grid-template-columns: min(30vw, 330px) 1fr;
}
</style>