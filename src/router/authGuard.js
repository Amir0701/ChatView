import * as AUTH_CONSTANTS from "@/store/modules/auth/constants";

export const redirectFromLogin = (to, from, next) => {
    const isAuthenticated = !!localStorage.getItem(AUTH_CONSTANTS.LOCALSTORAGE_KEY)

    if (to.path === '/auth' && isAuthenticated) next({ path: '/' })
    else next()
}

export const authGuard = (to, from, next) => {
    const isAuthenticated = !!localStorage.getItem(AUTH_CONSTANTS.LOCALSTORAGE_KEY)

    if (to.path !== '/auth' && !isAuthenticated) next({ path: '/auth' })
    else next()
}

export const notFound = (to, from, next) => {
    if (to.path !== 'not-found') next({ path: '/not-found' })
    else next()
}