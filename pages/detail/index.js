import {
  formatDate,
  formatPrice
} from "../../utils/util";
import {
  getStorage,
  goBack,
  isLogin,
  setStorage,
  toast
} from "../../utils/utilities";
import wxs from "../../utils/wxs"
const {
  getList,
} = require('../../utils/searchList')
// 获取应用实例
const app = getApp()
Page({
  data: {
    rect: app.globalData.rect,
    id: "",
    banner: [],
    degreeArr: ['九成新', '八成新', '七成新', '六成新', '五成新', '四成新', '三成新', '二成新', '一成新'],
    params: {
      categoryId: '',
      offset: 0,
      limit: 20,
      sort: 3
    },
    list: [],
    totalCount: 0,
    triggered: false,
    tabView: 'brief',
    callSwitch: false,
    is_invite_user_id: false
  },
  onLoad(options) {
    const {
      id,
      invite_user_id
    } = options;
    const rect = wx.getMenuButtonBoundingClientRect();
    console.log(rect)
    this.setData({
      id,
      is_invite_user_id: invite_user_id,
      rect
    })
  },
  onShow(options) {
    this.getDetail();
  },
  goBack() {
    let that = this;
    if (that.data.is_invite_user_id) {
      wx.switchTab({
        url: `/pages/index/index`,
      })
    } else {
      goBack();
    }
  },
  getDetail() {
    let that = this;
    const {
      id
    } = that.data;
    wxs.request({
      url: `api/v1/market/machine/${id}`
    }).then(({
      data
    }) => {
      const {
        cover,
        images
      } = data;
      let banner = [{
        'image': cover
      }];
      images.map((i) => {
        banner.push({
          'image': i
        })
      })
      images.unshift(cover)
      data.price = formatPrice(data.price)
      that.setData({
        banner,
        ['params.categoryId']: data.categoryId,
        ...data,
      })
      this.getList();
      this.getInfo();
    })
  },
  getInfo() {
    let that = this;
    wxs.request({
      url: `api/v1/user/${that.data.userId}/info`
    }).then(({
      data
    }) => {
      data.registerTime = formatDate(data.registerTime);
      that.setData({
        info: data
      })
    })
  },
  async setFavorite() {
    let that = this;
    const {
      favorites,
      id,
      isFavorite
    } = that.data;
    if (isFavorite) {
      await wxs.request({
        method: 'post',
        url: `api/v1/market/machine/${id}/delete/favorites`
      }).then((data) => {
        that.setData({
          favorites: favorites - 1,
          isFavorite: false
        })
      })
    } else {
      await wxs.request({
        method: 'post',
        url: `api/v1/market/machine/${id}/add/favorites`
      }).then((data) => {
        that.setData({
          favorites: favorites + 1,
          isFavorite: true
        })
      })
    }
    setStorage('favoriteItem', {
      id,
      isFavorite: that.data.isFavorite,
      favorites: that.data.favorites
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
  // 呼叫
  call() {
    let that = this;
    wxs.request({
      url: `api/v1/market/machine/${that.data.id}/add/calls`,
      method: 'post'
    }).then(() => {
      wx.makePhoneCall({
        phoneNumber: String(that.data.linkerMobile)
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
  switchTab(e) {
    const {
      view
    } = e.currentTarget.dataset;
    wx.pageScrollTo({
      selector: `.${view}`,
      offsetTop: -200
    })
    this.setData({
      tabView: view
    })
  },
  goCorporation(e) {
    const {
      userId
    } = this.data;
    wx.navigateTo({
      url: `/pages/corporation/index?id=${userId}`
    })
  },
  preview(e) {
    const {
      index
    } = e.currentTarget.dataset;
    const {
      images
    } = this.data;
    wx.previewImage({
      urls: images,
      current: images[index]
    })
  },
  getList() {
    let that = this;
    const {
      params,
      list,
      totalCount,
      id
    } = that.data;
    if (that.data.triggered) {
      return
    }
    that.setData({
      triggered: true
    })
    getList(params).then(({
      totalCount,
      records
    }) => {
      if (records.length) {
        params.offset += params.limit;
        records.splice(records.findIndex((i) => i.id == id), 1)
        that.setData({
          params,
          list: [...list, ...records],
          totalCount,
          triggered: false
        })
      } else {
        that.setData({
          triggered: true
        })
      }

    }).catch(() => {
      that.setData({
        triggered: false
      })
    });
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
  // 复制ID
  sopyId() {
    let that = this;
    const {
      id
    } = that.data;
    wx.setClipboardData({
      data: String(id),
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
  onReachBottom(e) {
    this.getList();
  },
  async followed() {
    let that = this;
    const {
      isFollowed,
      id,
    } = that.data.info;
    if (!isFollowed) {
      await wxs.request({
        url: `api/v1/self/follow/user/${id}`,
        method: "post"
      }).then(() => {
        toast("已关注")
      })
    } else {
      await wxs.request({
        url: `api/v1/self/cancel/follow/user/${id}`,
        method: "post"
      }).then(() => {
        toast("已取消")
      })
    }
    that.getInfo();
  },
  onShareAppMessage() {
    return {
      imageUrl: this.data.cover,
      title: this.data.name,
      path: `/pages/detail/index?id=${this.data.id}&invite_user_id=${getStorage('userid')||0}`
    }
  },
  onShareTimeline() {
    return {
      imageUrl: this.data.cover,
      title: this.data.name,
      path: `/pages/detail/index?id=${this.data.id}&invite_user_id=${getStorage('userid')||0}`
    }
  },
})