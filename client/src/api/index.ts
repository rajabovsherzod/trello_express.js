// This file is intentionally left blank to prevent circular dependencies.
// All axios instances are now defined in 'api/axios.ts'.


// $api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config
//         if(error.response.status === 401 && !originalRequest._retry){
//             originalRequest._retry = true
//             try {
//                 const { data } = await $axios.get('/users/refresh')
//                 const { user, accessToken } = data
//                 useAuthStore.getState().setUser(user, accessToken)
//                 originalRequest.headers.Authorization = `Bearer ${accessToken}`
//                 return $api(originalRequest)
//             } catch (error) {
//                 useAuthStore.getState().logout()
//                 return Promise.reject(error)
//             }
//         }
//     }
// )