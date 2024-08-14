import {
  formatDate
} from "../../utils/util";
import {
  getStorage,
  toast,
  isLogin
} from "../../utils/utilities";
import wxs from "../../utils/wxs"
const {
  getList,
} = require('../../utils/searchList')
const app = getApp();
Page({

  data: {
    id: "",
    info: {},
    list: [],
    params: {
      offset: 0,
      limit: 50,
    },
    totalCount: 0,
    unfoldFlag: false,
    callSwitch: false
  },
  onLoad(options) {
    this.setData({
      id: options.id,
      ['params.userId']: options.id
    })
  },

  onShow() {
    this.getInfo()
    this.getList();
    app.globalData.userinfo && app.globalData.userinfo.identityState != 2 && wx.hideShareMenu({
      menus: ['shareAppMessage']
    })
  },

  getInfo() {
    let that = this;
    wxs.request({
      url: `api/v1/user/${that.data.id}/info`
    }).then(({
      data
    }) => {
      data.registerTime = formatDate(data.registerTime);
      if (data.identity) {
        let photos = [];
        data.identity.photos.map((i) => {
          photos.push({
            'image': i
          })
        })
        data.identity.photos = photos;
      }
      that.setData({
        info: data
      })
    })
  },
  async followed() {
    let that = this;
    const {
      isFollowed
    } = that.data.info;
    if (!isFollowed) {
      await wxs.request({
        url: `api/v1/self/follow/user/${that.data.id}`,
        method: "post"
      }).then(() => {
        toast("已关注")
      })
    } else {
      await wxs.request({
        url: `api/v1/self/cancel/follow/user/${that.data.id}`,
        method: "post"
      }).then(() => {
        toast("已取消")
      })
    }
    that.getInfo();
  },
  preview(e) {
    const {
      img
    } = e.currentTarget.dataset
    wx.previewImage({
      urls: [img]
    })
  },
  getList() {
    let that = this;
    const {
      params,
      list,
      totalCount
    } = that.data;
    getList(params).then(({
      totalCount,
      records
    }) => {
      if (records.length) {
        params.offset += params.limit;
        that.setData({
          params
        })
      }
      that.setData({
        list: [...list, ...records],
        totalCount,
      })
    });
  },
  unfold() {
    this.setData({
      unfoldFlag: !this.data.unfoldFlag
    })
  },
  onShareAppMessage() {
    const {
      id,
      info
    } = this.data;
    return {
      title: info.nickname,
      imageUrl: info.identity.photos.length ? info.identity.photos[0].image : info.avatar,
      path: `/pages/corporation/index?id=${id}&invite_user_id=${getStorage('userid')}`
    }
  },
  call() {
    let that = this;
    wxs.request({
      url: `api/v1/user/${that.data.id}/call`,
      method: 'post'
    }).then(() => {
      wx.makePhoneCall({
        phoneNumber: String(that.data.info.mobile)
      })
    })
  },
  showCall() {
    this.isLogins();
    isLogin() && this.setData({
      callSwitch: true
    })
  },
  hideCall() {
    this.setData({
      callSwitch: false
    })
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
  // 检查是否登陆
  isLogins() {
    let that = this;
    if (!isLogin()) {
      this.setData({
        loginConfirmSwitch: true, //  提示去登录的 弹窗
      })
      return;
    }
  },

})