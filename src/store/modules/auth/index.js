import { authService } from '@/services'
import * as SNACKBAR_CONSTANTS from '@/store/modules/snackbar/constants'

import {
    ACTIONS,
    GETTERS,
    MUTATIONS,
    LOCALSTORAGE_KEY
} from './constants'
import router from "@/router";
import store from "@/store";

const initialState = {
    token: '',
    user: {
        id: null,
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
        [GETTERS.USER_INFO]: state => state.user,
        [GETTERS.TOKEN]: state => state.token
    },
    mutations: {
        [MUTATIONS.SET_USER]: (state, userDetails) => {
            state.user = userDetails
        },

        [MUTATIONS.RESET_STORE]: (state) => {
            state.user = initialState.user;
            state.token = '';
        },

        [MUTATIONS.SET_TOKEN]: (state, token) => {
            state.token = token
        }
    },
    actions: {
        [ACTIONS.LOGIN]: async (context, user) => {
            try {
                const data = await authService.login(user)

                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'success')
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, 'Welcome')
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
                localStorage.setItem(LOCALSTORAGE_KEY, data.accessToken)
                await context.commit(MUTATIONS.SET_TOKEN, data.accessToken)
                await context.commit(MUTATIONS.SET_USER, {
                    id: data?.userId,
                    username: 'John',
                    fullName: 'Doe'
                })

                await router.push({path: '/'})
            } catch (err) {
                const errMsg = err.response.data?.exceptions && err.response.data?.exceptions[0].message;

                await context.dispatch(ACTIONS.LOGOUT)
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg)
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
            }
        },

        [ACTIONS.REGISTER]: async (context, user) => {
            try {
                const data = await authService.register(user)

                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'success')
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, `Welcome ${data?.userId}`)
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
                localStorage.setItem(LOCALSTORAGE_KEY, data.accessToken)
                await context.commit(MUTATIONS.SET_TOKEN, data.accessToken)
                await context.commit(MUTATIONS.SET_USER, {
                    id: data?.userId,
                    username: 'John',
                    fullName: 'Doe'
                })

                await router.push({path: '/'})
            } catch (err) {
                const errMsg = err.response.data?.exceptions && err.response.data?.exceptions[0].message;

                await context.dispatch(ACTIONS.LOGOUT)
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red')
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg)
                store.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true)
            }
        },

        [ACTIONS.LOGOUT]: async (context) => {
            localStorage.removeItem(LOCALSTORAGE_KEY)
            context.commit(MUTATIONS.RESET_STORE)
            if (router.currentRoute.path !== '/auth') await router.push({path: '/auth'})
        }
    }
}