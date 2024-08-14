import {
  formatDate
} from "./util";
import {
  setStorage
} from "./utilities";
import wxs from "./wxs";
const app = getApp();
export const getUserInfo = (callback) => {
  wxs.request({
    url: 'api/v1/self/info'
  }).then(({
    data
  }) => {
    setStorage("userid", data.id);
    setStorage("WXavatar", data.image);
    setStorage("WXname", data.nickname);
    data.createdAt = formatDate(data.createdAt);
    app.globalData.userinfo = data;
    callback(data)
  })
}