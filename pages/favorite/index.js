import wxs from "../../utils/wxs"
import {
  isLogin,
  toast
} from "../../utils/utilities"
import {
  getUserInfo
} from "../../utils/userInfo"
import {
  formatPrice
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
      url: `api/v1/market/machine/me/favorites`,
    }).then(({
      data
    }) => {
      const {
        records
      } = data;
      records.map((i) => {
        i.price = formatPrice(i.price)
      })
      that.setData({
        list: records
      })
    })
  },
  // 取消收藏
  cancel(e) {
    const {
      id
    } = e.currentTarget.dataset.item;
    wxs.request({
      url: `api/v1/market/machine/${id}/delete/favorites`,
      method: "post"
    }).then(() => {
      toast("操作成功!")
      this.onShow();
    })
  },
  // 找相似
  likeness(e) {
    const {
      item
    } = e.currentTarget.dataset;
    wx.subPub.trigger('searchProduct', {
      categoryId: item.categoryId,
      categoryName: item.categoryName,
    });
    app.globalData.searchProduct = {
      categoryId: item.categoryId,
      categoryName: item.categoryName,
    };
    wx.switchTab({
      url: `/pages/product/index`,
    })
  },
  goDetil(e) {
    const {
      id,
      state
    } = e.currentTarget.dataset.item;
    if (state === 2) {
      toast('商品已下架')
      return;
    }
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  },
})