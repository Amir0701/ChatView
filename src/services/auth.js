import instance from '@/services/axios'

export default {
    login: payload => instance.post('/user/session', payload)
        .then(response => response.data),
    register: payload => instance.post('/user', payload)
        .then(response => response.data),
}