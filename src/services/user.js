import instance from '@/services/axios'

export default {
    login: payload => instance.post('/user/session', payload)
        .then(response => response.data),

    register: payload => instance.post('/user', payload)
        .then(response => response.data),

    getUserInfo: (userId, token) => instance.get(`/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data),

    updateProfile: (userId, token, data) => instance.put(`/user/${userId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data),
}