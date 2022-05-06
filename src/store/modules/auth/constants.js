export const GETTERS = {
    IS_AUTHENTICATED:   'IS_AUTHENTICATED',
    USER_INFO:          'USER_INFO',
    TOKEN:              'TOKEN'
}

export const MUTATIONS = {
    RESET_STORE:    'RESET_STORE',
    SET_USER:       'SET_USER',
    SET_TOKEN:      'SET_TOKEN'
}

export const ACTIONS = {
    LOGIN:      'LOGIN',
    REGISTER:    'REGISTER',
    LOGOUT:     'LOGOUT',
}

/*
* aes key generated in https://www.javainuse.com/aesgenerator
* plain text: token
* mode: ECB
* key size: 128
* secret key: `V3RyT0p$3cReTk3Y`
* output: hex*/
export const LOCALSTORAGE_KEY = `db0f50b9bb90f697ef9bfff9f270579c`;