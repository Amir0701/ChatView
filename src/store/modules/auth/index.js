import { authService } from '@/services'

import {
    ACTIONS,
    GETTERS,
    MUTATIONS,
    LOCALSTORAGE_KEY
} from './constants'

const initialState = {
    token: '',
    userDetails: {
        username: '',
        name: ''
    }
}

export default {
    namespaced: true,
    state: {
        ...initialState
    },
    getters: {
        [GETTERS.IS_AUTHENTICATED]: state => !!state.token,
        [GETTERS.USER_INFO]: state => state.userDetails,
        [GETTERS.TOKEN]: state => state.token
    },
    mutations: {
        [MUTATIONS.SET_USER]: (state, userDetails) => {
            state.userDetails = userDetails
        },

        [MUTATIONS.RESET_STORE]: (state) => {
            state.userDetails = initialState.userDetails;
            state.token = '';
        },

        [MUTATIONS.SET_TOKEN]: (state, token) => {
            console.log(`set token`)
            state.token = token
        }
    },
    actions: {
        [ACTIONS.LOGIN]: async (context, user) => {
            const data = await authService.login(user)

            if (!data) {
                await context.dispatch(ACTIONS.LOGOUT)
            } else {
                localStorage.setItem(LOCALSTORAGE_KEY, data.token)
                await context.commit(MUTATIONS.SET_TOKEN, data.token)
                await context.commit(MUTATIONS.SET_USER, data.user)
            }
        },

        [ACTIONS.LOGOUT]: async (context) => {
            localStorage.removeItem(LOCALSTORAGE_KEY)
            context.commit(MUTATIONS.RESET_STORE)
        }
    }
}