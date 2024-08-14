import {
  getStorage,
  loginRemind,
  toast
} from "./utilities"

const develop = 'https://api-dev.eithergo.com/' // 开发
const pre = 'https://api.eithergo.com/' // 预发
const release = 'https://api.eithergo.com/' // 正式

const env = __wxConfig.envVersion
if (!env) {
  console.error("获取运行环境失败!");
}
const baseApi = {
  // 开发版 
  develop: develop,
  // 体验版
  trial: develop,
  // 正式版
  release
};

export default {
  request(obj) {
    return new Promise(function (resolve, reject) {
      wx.request({
        timeout: obj.timeout || 5000,
        url: `${baseApi[env] || release}${obj.url}`,
        method: obj.method || 'GET',
        header: {
          'content-type': 'application/json',
          'X-Auth-Token': getStorage("accesstoken"),
          ...obj.header || {}
        },
        data: obj.data || {},
        success(res) {
          if (res.data.code == 401) {
            // 登陆过期了
            loginRemind();
          } else if (res.data.code != 1) {
            toast(`${res.data.message}`)
            reject(res);
          } else if (res.statusCode != 200) {
            toast('服务器错误')
          } else {
            resolve(res.data);
          }
        },
        fail(res) {
          reject(res);
        }
      })
    })
  }
}