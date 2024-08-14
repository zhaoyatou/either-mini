import wxs from "../../utils/wxs"
import {
  confirm,
  isLogin,
  toast
} from "../../utils/utilities"
import {
  getUserInfo
} from "../../utils/userInfo"
import {
  formatDate,
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
    const {
      id: userId
    } = that.data.userinfo;
    wxs.request({
      url: `api/v1/market/machine/list`,
      data: {
        userId,
        isSelf: true
      }
    }).then(({
      data
    }) => {
      const {
        records
      } = data;
      records.map((i) => {
        i.price = formatPrice(i.price)
        let launchedAt = i.launchedAt;
        i.launchedAt = formatDate(launchedAt, "yyyy-MM-dd hh:mm")
        i.takedownAt = formatDate((launchedAt + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd hh:mm")
      })
      that.setData({
        list: records
      })
    })
  },
  // 修改
  amend(e) {
    const {
      item
    } = e.currentTarget.dataset;
    if (item.state == 1) {
      toast("请下架后修改")
      return
    }
    app.globalData.amendId = item.id;
    wx.subPub.trigger('upMyProduct', item.id);
    wx.switchTab({
      url: `/pages/publish/index`,
    })
  },
  // 删除
  delItem(e) {
    const {
      item
    } = e.currentTarget.dataset;
    if (item.state == 1) {
      toast("请下架后删除")
      return
    }
    confirm({
      title: '提示',
      content: "确认该删除商品吗？",
      success: ({
        confirm
      }) => {
        confirm && wxs.request({
          url: `api/v1/market/machine/${item.id}/delete`,
          method: "delete"
        }).then(() => {
          toast("操作成功!")
          this.onShow();
        })
      }
    })

  },
  // 下架
  launItem(e) {
    const {
      id
    } = e.currentTarget.dataset.item;
    wxs.request({
      url: `api/v1/market/machine/${id}/off-sale`,
      method: "post"
    }).then(() => {
      toast("操作成功!")
      this.onShow();
    })
  },
  // 上架
  upItem(e) {
    const {
      id
    } = e.currentTarget.dataset.item;
    wxs.request({
      url: `api/v1/market/machine/${id}/on-sale`,
      method: "post"
    }).then(() => {
      toast("操作成功!")
      this.onShow();
      wx.requestSubscribeMessage({
        tmplIds: ['C1FrPQ2FVB8fFdx6NYQYipKIOkXputYcnoXP6jNu1CI'],
      })
    })
  },

})