import {
    GETTERS,
    MUTATIONS
} from './constants'

export default {
    namespaced: true,
    state: {
        is_shown: false,
        message: '',
        color: '',
        timeout: 1500
    },
    getters: {
        [GETTERS.IS_SHOWN]: state => state.is_shown,
        [GETTERS.MESSAGE]: state => state.message,
        [GETTERS.COLOR]: state => state.color,
        [GETTERS.TIMEOUT]: state => state.timeout,
    },
    mutations: {
        [MUTATIONS.SET_VISIBILITY]: (state, status) => {
            state.is_shown = status
        },
        [MUTATIONS.SET_MESSAGE]: (state, message) => {
            state.message = message
        },
        [MUTATIONS.SET_COLOR]: (state, color) => {
            state.color = color
        },
        [MUTATIONS.SET_TIMEOUT]: (state, timeout) => {
            state.timeout = timeout
        },
    }
}