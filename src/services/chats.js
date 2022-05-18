import instance from '@/services/axios'

export default {
    getChats: (userId, token) => instance.get('/chat', {
        params: { userId },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data),
}