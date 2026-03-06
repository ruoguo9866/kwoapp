import $kres from './request'

export const userApi = {
  login: (data) => $kres.post('/user/login', data),
  getUserInfo: () => $kres.get('/user/info'),
  getUserDetail: () => $kres.get('/user/detail'),
  updateUserProfile: (data) => $kres.post('/user/update', data),
}

export const homeApi = {
  getHomeInfo: () => $kres.get('/home/info'),
}
