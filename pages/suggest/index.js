import {
  formatDate
} from "../../utils/util";
import wxs from "../../utils/wxs"
Page({

  data: {
    list: [],
  },

  onShow() {
    this.getList();
  },

  getList() {
    let that = this;
    wxs.request({
      url: `api/v1/self/advices`
    }).then(({
      data
    }) => {
      data.map((i) => {
        i.updatedAt = formatDate(i.updatedAt)
      })
      that.setData({
        list: data
      })
    })
  },
  goSubmit() {
    wx.navigateTo({
      url: `/pages/suggest/submit/index`,
    })
  }

})