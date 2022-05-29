import * as CHATS_CONSTANTS from "@/store/modules/chats/constants";
import * as SNACKBAR_CONSTANTS from "@/store/modules/snackbar/constants";

export default function createWebSocketPlugin(stompClient) {
    return store => {
        store.$stompClient = stompClient

        stompClient.connect(
            {},
            () => {
                stompClient.subscribe('/topic/send', payload => {
                    console.log(`received: ${payload}`);
                    try {
                        store.dispatch(`chats/${CHATS_CONSTANTS.ACTIONS.RECEIVE_MSG}`, JSON.parse(payload.body).content)
                    } catch (e) {
                        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
                        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, 'Error while parsing ws income msg.')
                        store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
                    }
                });
            },
            error => {
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, error)
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
            }
        );
    }
}