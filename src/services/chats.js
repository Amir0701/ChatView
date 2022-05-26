import instance from '@/services/axios'

export default {
    getChats: (userId, token) => instance.get('/chat', {
        params: { userId },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data),

    createChat: (token, data) => instance.post(`/chat`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data),

    deleteChat: (token, chatId) => instance.delete(`/chat/${chatId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data),

    addUsersToChat: (chatId, users, token) => instance.put(`/chat/${chatId}`, users, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.data),
}