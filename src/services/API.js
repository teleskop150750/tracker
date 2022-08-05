// /*
//  * Это начальный интерфейс API
//  * мы задаем базовый URL-адрес для API
//  */

// import axios from "axios";
// import { useAuth } from "../composables/useAuth";

// export const apiClient = axios.create({
//   baseURL: process.env.VUE_APP_API_URL,
//   withCredentials: true, // требуется для обработки токена CSRF
// });

// /*
//  * Добавьте перехватчик ответов
//  */
// apiClient.interceptors.response.use(
//   function (response) {
//     // Любой код состояния, который находится в диапазоне 2xx, вызывает срабатывание этой функции
//     // Сделайте что-нибудь с данными ответа
//     return response.data;
//   },
//   function (error) {
//     if ([401, 403].includes(error.response.status)) {
//       const auth = useAuth();
//       auth.logout();
//     }

//     return Promise.reject(error.response.data);
//   }
// );
