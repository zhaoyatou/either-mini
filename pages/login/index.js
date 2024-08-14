import wxs from "../../utils/wxs"
const {
  toast,
  setStorage,
  goBack
} = require('../../utils/utilities')
const app = getApp();
Page({
  data: {
    isSelected: true,
    source_type: '',
  },
  onLoad: function (options) {
    console.log(app.globalData.invite_user_id)
    //直接登录
    let that = this;
    wx.login({
      success: res => {
        let code = res.code;
        wxs.request({
          url: `api/v1/auth/mini/login`,
          method: 'post',
          data: {
            code: code,
            inviteUserId: app.globalData.invite_user_id,
            nickname: "微信用户",
            avatar: 'https://cdn.eithergo.com/image/2024-01-05/1_w_512_h_512_1704439373_3688.jpg',
          },
        }).then(res => {
          if (res.code == 1) {
            let code1Data = res;
            that.setData({
              code1Data,
            })
          } else {
            toast(res.message);
          }
        })
      }
    });
  },

  stepOneLogin() {
    let that = this;
    setTimeout(() => {
      that.save(that.data.code1Data);

      toast('登录成功,自动返回中...');
      setTimeout(() => {
        goBack()
      }, 1500);

    }, 1000);;
  },
  agree() {
    if (!this.data.isSelected) {
      toast('请阅读并勾选页面协议');
      return;
    }
  },
  check() {
    this.setData({
      isSelected: !this.data.isSelected,
    });
  },
  onShow() {},
  save(res) {
    console.log(res)
    setStorage("accesstoken", res.data.authToken);
    setStorage("userid", res.data.userId);
  },
})