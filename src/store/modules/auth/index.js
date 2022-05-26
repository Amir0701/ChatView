import { authService } from '@/services'
import * as SNACKBAR_CONSTANTS from '@/store/modules/snackbar/constants'

import {
    ACTIONS,
    GETTERS,
    MUTATIONS,
    LOCALSTORAGE_KEY
} from './constants'
import router from "@/router";

const initialState = {
    token: '',
    user: {
        id: null,
        nickname: '',
        name: '',
        email: ''
    }
}

export default {
    namespaced: true,
    state: {
        ...initialState
    },
    getters: {
        [GETTERS.USER_INFO]: state => state.user,
        [GETTERS.TOKEN]: state => state.token
    },
    mutations: {
        [MUTATIONS.SET_USER]: (state, userDetails) => {
            state.user.id = userDetails?.id
            state.user.nickname = userDetails?.nickname
            state.user.name = userDetails?.name
            state.user.email = userDetails?.email
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

                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'success', { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, `Welcome`, { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true, { root: true })
                localStorage.setItem(LOCALSTORAGE_KEY, data?.accessToken)
                await context.commit(MUTATIONS.SET_TOKEN, data?.accessToken)
                await context.commit(MUTATIONS.SET_USER, { id: data?.userId })

                await router.push({path: '/'})
            } catch (err) {
                const errMsg = err.response?.data?.exceptions && err.response?.data?.exceptions[0].message || 'Internal error';

                await context.dispatch(ACTIONS.LOGOUT)
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red', { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg, { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true, { root: true })
            }
        },

        [ACTIONS.REGISTER]: async (context, user) => {
            try {
                const data = await authService.register(user)

                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'success', { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, `Welcome`, { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true, { root: true })
                localStorage.setItem(LOCALSTORAGE_KEY, data.accessToken)
                await context.commit(MUTATIONS.SET_TOKEN, data.accessToken)
                await context.commit(MUTATIONS.SET_USER, { id: data?.userId })

                await router.push({path: '/'})
            } catch (err) {
                const errMsg = err.response?.data?.exceptions && err.response?.data?.exceptions[0].message || 'Internal error';

                await context.dispatch(ACTIONS.LOGOUT)
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red', { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg, { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true, { root: true })
            }
        },

        [ACTIONS.LOGOUT]: async (context) => {
            localStorage.removeItem(LOCALSTORAGE_KEY)
            context.commit(MUTATIONS.RESET_STORE)
            if (router.currentRoute.path !== '/auth') await router.push({path: '/auth'})
        },

        [ACTIONS.GET_USER_INFO]: async (context, {id, token}) => {
            try {
                // eslint-disable-next-line
                const { password, ...data } = await authService.getUserInfo(id, token)

                await context.commit(MUTATIONS.SET_USER, data)
            } catch (err) {
                const errMsg = err.response?.data?.exceptions && err.response?.data?.exceptions[0].message || 'Internal error';
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_COLOR}`, 'red', { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_MESSAGE}`, errMsg, { root: true })
                context.commit(`snackbar/${SNACKBAR_CONSTANTS.MUTATIONS.SET_VISIBILITY}`, true, { root: true })
            }
        }
    }
}