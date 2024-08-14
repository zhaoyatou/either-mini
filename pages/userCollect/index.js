import {
  formatDate
} from "../../utils/util";
import {
  toast
} from "../../utils/utilities";
import wxs from "../../utils/wxs"
Page({

  data: {
    list: [],
  },

  onShow() {
    this.getFollowUsers()
  },
  getFollowUsers() {
    let that = this;
    wxs.request({
      url: `api/v1/self/follow/users`
    }).then(({
      data
    }) => {
      that.setData({
        list: data.records
      })
    })
  },
  followed(e) {
    let that = this;
    const {
      id,
    } = e.currentTarget.dataset;
    wxs.request({
      url: `api/v1/self/cancel/follow/user/${id}`,
      method: "post"
    }).then(() => {
      toast("已取消");
      that.getFollowUsers();
    })
  },
  goSearch() {
    wx.navigateTo({
      url: '/pages/searchUser/index'
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