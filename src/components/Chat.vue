<template>
  <v-scale-transition :hide-on-leave="false">
    <v-col
        cols="auto"
        class="flex-grow-1 flex-shrink-0"
        v-show="activeChat"
    >
      <v-responsive
          v-if="activeChat"
      >
        <v-card
            flat
            class="d-flex flex-column fill-height"
        >
          <v-card-title class="indigo lighten-3">
            <span class="text-h5">{{ activeChat.name }}</span>

            <v-spacer></v-spacer>

            <v-menu
                transition="slide-y-transition"
                bottom
                left
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
                <v-list-item @click="deleteChat(activeChat.id)">
                  <v-list-item-title class="red--text">Delete chat</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-divider/>
          <v-card-text class="flex-grow-1 overflow-y-auto" style="height: calc(100vh - 230px)">
            <template v-for="(msg) in activeChat.messages">
              <div
                  :key="msg.id"
                  :class="{ 'd-flex flex-row-reverse': userInfo.id === msg.userId }"
              >
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-hover
                        v-slot:default="{ hover }"
                    >
                      <v-chip
                          :color="userInfo.id === msg.userId ? 'primary' : ''"
                          dark
                          style="height:auto;white-space: normal;"
                          class="pa-4 mb-2"
                          v-on="on"
                      >
                        hello
                        {{ msg.imageDtoSet.length }}
                        <sub
                            class="ml-2"
                            style="font-size: 0.5rem;"
                        >{{ msg.whenCreated }}</sub>
                        <v-icon
                            v-if="hover"
                            small
                        >
                          expand_more
                        </v-icon>
                      </v-chip>
                    </v-hover>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-card-text>
          <v-card-text class="flex-shrink-1">
            <v-text-field
                v-model="newMsg"
                label="Type a message"
                type="text"
                no-details
                outlined
                @keyup.enter="sendMessage()"
                hide-details
            >
              <template v-slot:append-outer>
                <v-icon large @click="sendMessage()" color="indigo lighten-1">mdi-send</v-icon>
              </template>
            </v-text-field>
          </v-card-text>
        </v-card>
      </v-responsive>
    </v-col>
  </v-scale-transition>
</template>

<script>
import {mapGetters} from "vuex";

import * as CHATS_CONSTANTS from "@/store/modules/chats/constants";
import * as AUTH_CONSTANTS from "@/store/modules/auth/constants";
import store from "@/store";

export default {
  name: 'Chat',
  computed: {
    ...mapGetters({
      activeChat: `chats/${CHATS_CONSTANTS.GETTERS.ACTIVE_CHAT}`,
      chats: `chats/${CHATS_CONSTANTS.GETTERS.CHATS}`,
      userInfo: `auth/${AUTH_CONSTANTS.GETTERS.USER_INFO}`,
      token: `auth/${AUTH_CONSTANTS.GETTERS.TOKEN}`,
    })
  },
  data: () => ({
    newMsg: '',
  }),
  methods: {
    sendMessage: function () {
      console.log(this.newMsg)
    },

    deleteChat: async function (chatId) {
      await store.dispatch(`chats/${CHATS_CONSTANTS.ACTIONS.DELETE_CHAT}`, {token: this.token, chatId})
    },
  }
}
</script>

<style>
.v-application--is-ltr .v-input__append-outer {
  margin: 10px 0 10px 10px !important;
}
</style>