import {authService} from '@/services'

import {
    GETTERS,
    MUTATIONS,
    ACTIONS,
    LOCALSTORAGE_KEY
} from './constants'

const initialState = {
    isAuthenticated: false,
    user: {
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
        [GETTERS.IS_AUTHENTICATED]: state => state.isAuthenticated,
        [GETTERS.USER_INFO]: state => state.user
    },
    mutations: {
        [MUTATIONS.SET_USER]: (state, payload) => {
            state.user = payload?.user
            state.isAuthenticated = true
        },

        [MUTATIONS.RESET_STORE]: (state) => {
            state.user = initialState.user;
            state.isAuthenticated = false;
        }
    },
    actions: {
        [ACTIONS.LOGIN]: async (context, user) => {
            const data = await authService.login(user)

            console.log(data)
            if (!data) {
                await context.dispatch(ACTIONS.LOGOUT)
            } else {
                localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data))
                await context.commit(MUTATIONS.SET_USER, data)
            }
        },

        [ACTIONS.LOGOUT]: async (context) => {
            localStorage.removeItem(LOCALSTORAGE_KEY)
            context.commit(MUTATIONS.RESET_STORE)
        }
    }
}