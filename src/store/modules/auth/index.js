import { authService } from '@/services'

import {
    ACTIONS,
    GETTERS,
    MUTATIONS,
    LOCALSTORAGE_KEY
} from './constants'
import router from "@/router";

const initialState = {
    token: '',
    userDetails: {
        username: '',
        fullName: ''
    }
}

export default {
    namespaced: true,
    state: {
        ...initialState
    },
    getters: {
        [GETTERS.IS_AUTHENTICATED]: state => state.token,
        [GETTERS.USER_INFO]: state => state.userDetails,
        [GETTERS.TOKEN]: state => state.token
    },
    mutations: {
        [MUTATIONS.SET_USER]: (state, userDetails) => {
            state.userDetails.fullName = userDetails.fullName
            state.userDetails.username = userDetails.username
        },

        [MUTATIONS.RESET_STORE]: (state) => {
            state.userDetails = initialState.userDetails;
            state.token = '';
        },

        [MUTATIONS.SET_TOKEN]: (state, token) => {
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
            if (router.currentRoute.path !== '/login') await router.push({path: '/login'})
        }
    }
}