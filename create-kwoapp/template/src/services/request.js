import kres from '@ruoguo/kres';
import { Storage } from '@ruoguo/k-storage';

// 基础地址：优先读环境变量，其次默认 '/api'
const baseURL = import.meta.env.VITE_API_BASE || '/api';

// 创建实例
const request = kres.create({
    baseURL,
    timeout: 10000,
});


// 请求拦截器：这里可以统一加 token、公共头等
request.interceptors.request.use(
    (config) => {
        const token = Storage.get('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// 响应拦截器：统一处理返回结果和错误
const TOKEN_KEY = 'token';
request.interceptors.response.use(
    (response) => {
        // kres 默认把 body 放在 response.data，这里直接返回 data 方便使用
        return response.data;
    },
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            Storage.remove(TOKEN_KEY);
            const path = window.location.pathname + window.location.search;
            if (path !== '/login' && !path.startsWith('/login')) {
                window.location.href = path ? `/login?from=${encodeURIComponent(path)}` : '/login';
            }
        } else {
            console.error('请求出错：', error);
        }
        return Promise.reject(error);
    },
);

const get = (url, params, config = {}) =>
    request.get(url, params, config);

// 通用 POST
const post = (url, data, config = {}) =>
    request.post(url, data, config);
const $kres = {
    get, post
}

export default $kres