import wxs from "../../utils/wxs"
import {
  isLogin,
  toast
} from "../../utils/utilities"
import {
  getUserInfo
} from "../../utils/userInfo"
import {
  formatDate
} from "../../utils/util";
const app = getApp();
Page({
  data: {
    list: [],
  },

  onShow() {
    let that = this;
    if (isLogin()) {
      getUserInfo((userinfo) => {
        that.setData({
          userinfo,
        })
        that.getList();
      })
    }
  },
  getList() {
    let that = this;
    wxs.request({
      url: `api/v1/market/machine/view/history`,
    }).then(({
      data
    }) => {
      const {
        records
      } = data;
      records.map((i) => {
        i.updatedAt = formatDate(i.updatedAt, "yyyy-MM-dd hh:mm")
      })
      that.setData({
        list: records
      })
    })
  },
  goDetil(e) {
    const {
      id,
      state
    } = e.currentTarget.dataset.item;
    if (state !== 1) {
      toast('商品已下架')
      return;
    }
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  },
})