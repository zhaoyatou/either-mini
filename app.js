const subPub = require("./utils/subpub");
const {
  getStorage
} = require('./utils/utilities')
App({
  onLaunch({
    query
  }) {
    console.log(query)
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (query.invite_user_id) {
      this.globalData.invite_user_id = query.invite_user_id;
    }
    wx.subPub = subPub;
    // 登录
    wx.login({
      success: (res) => {}
    })
  },
  globalData: {
    userinfo: null,
    amendId: '',
    searchProduct: {},
    invite_user_id: '',
    rect: wx.getMenuButtonBoundingClientRect(),
  }
})