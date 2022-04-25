import instance from '@/services/axios'

export default {
    login: payload => instance.post('/auth/login', payload)
        .then(response => response.data),
    refreshToken: () => {}
}