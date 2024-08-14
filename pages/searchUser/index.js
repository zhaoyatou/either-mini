import {
  goBack,
  toast,
} from "../../utils/utilities"

import wxs from '../../utils/wxs'
Page({
  goBack,
  data: {
    list: [],
    placehoder: '请输入用户昵称',
    nickname: '',
  },
  onShow() {
    this.getBanner();
  },
  getList() {
    let that = this;
    wxs.request({
      url: `api/v1/user/search`,
      data: {
        nickname: that.data.nickname
      }
    }).then(({
      data
    }) => {
      that.setData({
        list: data.records
      })
    })
  },
  setSearchUser(e) {
    let that = this;
    const nickname = e.detail.value;
    if (!!!nickname) {
      toast('请输入昵称')
      return;
    }
    that.setData({
      nickname
    })
    that.getList(nickname);
  },

  async followed(e) {
    let that = this;
    const {
      list
    } = that.data;
    const {
      index
    } = e.currentTarget.dataset;
    const {
      isFollowed,
      id
    } = list[index];
    console.log(list[index])
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
    that.getList();
  },
  getBanner() {
    let that = this;
    wxs.request({
      url: 'api/v1/website/banners',
    }).then(({
      data
    }) => {
      that.setData({
        banner: data.filter(i => i.position === 7)[0].banners,
      })
    })
  },
  goCorporation(e) {
    const {
      id
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/corporation/index?id=${id}`
    })
  }


})