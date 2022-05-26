import {ACTIONS, GETTERS, MUTATIONS} from "@/store/modules/chats/constants";
import {chatsService} from "@/services";
import * as SNACKBAR_CONSTANTS from "@/store/modules/snackbar/constants";

export default {
    namespaced: true,
    state: {
        chats: []
    },
    getters: {
        [GETTERS.CHATS]: state => state.chats,
        [GETTERS.CHAT]: (state, id) => state.chats.find(chat => chat?.id === id)
    },
    mutations: {
        [MUTATIONS.ADD_CHATS]: (state, chats) => {
            state.chats.push(...chats)
        },

        [MUTATIONS.REMOVE_CHATS]: (state) => {
            (state.chats || []).splice(0, (state.chats || []).length)
        },

        [MUTATIONS.DELETE_CHAT]: (state, chatId) => {
            const idx = state.chats.findIndex(chat => chat.id === chatId)
            if (idx >= 0) state.chats.splice(idx, 1)
        }
    },

    actions: {
        [ACTIONS.GET_CHATS]: async (context, { userId, token }) => {
            try {
                const data = await chatsService.getChats(userId, token)

                context.commit(MUTATIONS.REMOVE_CHATS)
                context.commit(MUTATIONS.ADD_CHATS, data)
            } catch (err) {
                const errMsg = err.response.data?.exceptions && err.response.data?.exceptions[0].message;

                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red', { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg, { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true, { root: true })
            }
        },

        [ACTIONS.DELETE_CHAT]: async (context, {token, chatId}) => {
            try {
                // eslint-disable-next-line
                const id = await chatsService.deleteChat(token, chatId)

                context.commit(`${MUTATIONS.DELETE_CHAT}`, chatId)
            } catch (err) {
                const errMsg = err.response.data?.exceptions && err.response.data?.exceptions[0].message;

                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red', { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg, { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true, { root: true })
            }
        }
    }
}