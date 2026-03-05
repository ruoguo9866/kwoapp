import $kres from './request'

export const userApi = {
  login: (data) => $kres.post('/user/login', data),
  getUserInfo: () => $kres.get('/user/info'),
}

export const homeApi = {
  getHomeInfo: () => $kres.get('/home/info'),
}
