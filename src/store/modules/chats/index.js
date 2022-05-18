import {ACTIONS, GETTERS, MUTATIONS} from "@/store/modules/chats/constants";
import {chatsService} from "@/services";

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
    },

    actions: {
        [ACTIONS.GET_CHATS]: async (context, { userId, token }) => {
            try {
                const data = await chatsService.getChats(userId, token)

                console.log(data)
            } catch (e) {
                console.log(e)
            }
        }
    }
}