<template>
  <v-col
      cols="12"
      sm="3"
      class="flex-grow-1 flex-shrink-0"
      style="border-right: 1px solid #0000001f;"
  >
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
                        <img :src="data.item.avatar" :alt="data.item.nickname"/>
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
    <v-responsive class="fill-height">
      <v-container>
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
          <v-col cols="12" class="overflow-y-auto pa-0" style="height: calc(100vh - 136px);">
            <v-list subheader>
              <v-list-item-group v-model="activeChatIdx" >
                <template v-for="(item, index) in chat_list">
                  <v-list-item
                      :key="`${item.id}|${index}`"
                      :value="item.id"
                  >
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
                      <v-list-item-title v-text="item.name"/>
                      <v-list-item-subtitle v-text="'foo bar'"/>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon :color="activeChatIdx === item.id ? 'deep-purple accent-4' : 'grey'">
                        mdi-message-text
                      </v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-divider
                      :key="`${item.id}||${index}`"
                      class="my-0"
                  />
                </template>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

    </v-responsive>
  </v-col>
</template>

<script>
import {mapGetters} from "vuex";

import store from "@/store";
import * as CHATS_CONSTANTS from "@/store/modules/chats/constants";
import * as SNACKBAR_CONSTANTS from "@/store/modules/snackbar/constants";
import * as AUTH_CONSTANTS from "@/store/modules/auth/constants";
import {authService, chatsService} from "@/services";

export default {
  name: 'ChatList',
  computed: {
    ...mapGetters({
      activeChat: `chats/${CHATS_CONSTANTS.GETTERS.ACTIVE_CHAT}`,
      chats:      `chats/${CHATS_CONSTANTS.GETTERS.CHATS}`,
      token:      `auth/${AUTH_CONSTANTS.GETTERS.TOKEN}`,
    }),
  },
  data: () => ({
    chat_list: [],
    activeChatIdx: -1,
    searchBoxQuery: '',
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
    activeChatIdx: function (idx) {
      const chatListIdx = this.chats.findIndex(chat => chat.id === idx)
      if (chatListIdx >= 0) {
        store.commit(`chats/${CHATS_CONSTANTS.MUTATIONS.SET_ACTIVE_CHAT}`, this.chats[chatListIdx])
      }
    },

    'createChatDialog.search': function (val) {
      val && val !== this.createChatDialog.participants && this.fetchUsersDebounce(val)
    },

    searchBoxQuery: function (pattern) {
      if (pattern && (pattern || '').trim()) {
        this.chat_list = this.chats.filter(chat => chat.name.includes(pattern))
      } else {
        this.chat_list = this.chats
      }
    },
  },

  created: function() {
    this.chat_list = this.chats
  },

  methods: {
    fetchUsersDebounce: function (pattern, timeMS = 500) {
      clearTimeout(this.createChatDialog.timerId)

      this.createChatDialog.timerId = setTimeout(() => {
        this.querySearchUsers(pattern)
      }, timeMS)
    },

    querySearchUsers: async function (pattern) {
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

    remove: function (item) {
      const index = this.createChatDialog.participants.findIndex(participant => participant.name === item.name && participant.nickname === item.nickname)
      if (index >= 0) this.createChatDialog.participants.splice(index, 1)
    },

    getRandomColor: function () {
      return this.colors[Math.ceil(Math.random() * (this.colors.length - 1))]
    },

    openChatDialog: function () {
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

    createChat: async function () {
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
  }
}
</script>

<style scoped>

</style>