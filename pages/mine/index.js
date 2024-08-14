import wxs from "../../utils/wxs"
import {
  isLogin,
  toast
} from "../../utils/utilities"
import {
  getUserInfo
} from "../../utils/userInfo"
const app = getApp()
Page({

  data: {
    loginConfirmSwitch: false,
    rect: app.globalData.rect,
    userIdentity: {},
    unfoldFlag: false
  },
  onShow() {
    let that = this;
    const rect = wx.getMenuButtonBoundingClientRect();
    that.setData({
      rect
    })
    that.getTabBar().setData({
      selected: 4
    });
    that.isLogins();
    if (isLogin()) {
      getUserInfo((userinfo) => {
        userinfo.identityState != 0 && that.getIdentity();

        userinfo.identityState != 2 && wx.hideShareMenu({
          menus: ['shareAppMessage']
        })
        that.setData({
          userinfo,
        })
      })
    }
  },
  // 获取认证信息
  getIdentity() {
    let that = this;
    if (isLogin()) {
      wxs.request({
        url: `api/v1/self/identity`
      }).then(({
        data
      }) => {
        let photos = [];
        data.photos.map((i) => {
          photos.push({
            'image': i
          })
        })
        data.photos = photos;
        that.setData({
          userIdentity: data
        })
      })
    }
  },
  // 复制ID
  sopyId() {
    let that = this;
    that.isLogins();
    const {
      userinfo
    } = that.data;
    isLogin() && wx.setClipboardData({
      data: String(userinfo.id),
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  // 检查是否登陆
  isLogins() {
    let that = this;
    if (!isLogin()) {
      that.setData({
        loginConfirmSwitch: true, //  提示去登录的 弹窗
      })
      return;
    }
  },
  // 登陆弹框
  hideConfirm() {
    this.setData({
      loginConfirmSwitch: false,
    })
  },
  sure() {
    this.setData({
      loginConfirmSwitch: false,
    })
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  // 跳转认证
  goUserIdentity(e) {
    let that = this;
    that.isLogins();
    const {
      type
    } = e.currentTarget.dataset;
    isLogin() && wx.navigateTo({
      url: `/pages/userIdentity/index?type=${type}`,
    })
  },
  // 我的商品
  goMyCart() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/myCart/index`,
    })
  },
  // 我的收藏
  goFavorite() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/favorite/index`,
    })
  },
  // 我的浏览记录
  goHistory() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/history/index`,
    })
  },
  // 建议
  goSuggest() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/suggest/index`,
    })
  },
  // 联系我们
  goRelation() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/relationMe/index`,
    })
  },
  // 合作推广
  goTeamwork() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/teamwork/index`,
    })
  },
  // 会员VIP
  goVip() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/vip/index`,
    })
  },
  // 我的关注
  goUserCollect() {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/userCollect/index`,
    })
  },
  // 设置
  goUserSetting(e) {
    let that = this;
    that.isLogins();
    isLogin() && wx.navigateTo({
      url: `/pages/userSetting/index`,
    })
  },
  preview(e) {
    const {
      img
    } = e.currentTarget.dataset
    wx.previewImage({
      urls: [img]
    })
  },
  unfold() {
    this.setData({
      unfoldFlag: !this.data.unfoldFlag
    })
  },
  getPhoneNumber(e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let mobile_code = e.detail.code;
      that.lastStep({
        mobile_code: mobile_code,
      })
    }
  },
  lastStep(obj) {
    let that = this;
    wxs.request({
      url: `api/v1/auth/mini/bind/mobile`,
      method: 'post',
      data: {
        miniMobileCode: obj.mobile_code,
      },
    }).then(res => {
      if (res.code == 1) {
        toast("保存成功")
        getUserInfo((userinfo) => {
          userinfo.identityState != 0 && that.getIdentity();
          that.setData({
            userinfo,
          })
        })
      } else {
        toast(res.message);
      }
    })
  },
  onShareAppMessage() {
    const {
      userinfo,
      userIdentity
    } = this.data;

    return {
      title: userinfo.nickname,
      imageUrl: userIdentity.photos.length ? userIdentity.photos[0].image : userinfo.avatar,
      path: `/pages/corporation/index?id=${userinfo.id}&invite_user_id=${userinfo.id}`
    }
  }
})