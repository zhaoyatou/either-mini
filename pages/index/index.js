import {
  getStorage,
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
    list: [],
    totalCount: 0,
    categoryTopList: [],
    banner: [],
    topAdveImgs: [],
    typeIndex: 0,
    region: [],
    categoryName: '',
    params: {
      offset: 0,
      limit: 20,
      sort: 1
    },
    refresh: false,
  },
  onLoad() {
    let that = this;
    const rect = wx.getMenuButtonBoundingClientRect();
    that.setData({
      rect
    })
    this.getBanner();
    this.getCategoryTopList();
    this.getList();
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
        refresh: false
      })
    });
  },
  onShow() {
    this.getTabBar().setData({
      selected: 0
    });
  },
  getBanner() {
    let that = this;
    wxs.request({
      url: 'api/v1/website/banners',
    }).then(({
      data
    }) => {
      that.setData({
        banner: data.filter(i => i.position === 2)[0].banners,
        topAdveImgs: data.filter(i => i.position === 3)[0].banners,
      })
    })
  },
  getCategoryTopList() {
    wxs.request({
      url: "api/v1/machine/category/top/list",
    }).then(({
      data: categoryTopList
    }) => {
      this.setData({
        categoryTopList: categoryTopList.splice(0, 9)
      })
    })
  },
  searchList({
    detail
  }) {
    let that = this;
    const {
      params
    } = that.data;
    const {
      city,
      degreeType,
      categoryId
    } = detail;
    console.log(detail)
    params.offset = 0;
    city && (params.city = city);
    degreeType && (params.degreeType = degreeType);
    categoryId && (params.categoryId = categoryId);
    that.setData({
      params,
      list: []
    })
    that.getList();
  },
  getMore() {
    const {
      totalCount,
      list
    } = this.data;
    if (totalCount > list.length) {
      this.getList();
    }
  },
  goSearch() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },
  goSort(e) {
    const {
      id
    } = e.currentTarget.dataset;
    app.globalData.sortId = id;
    wx.switchTab({
      url: `/pages/sort/index`,
    })
  },
  upList() {
    let that = this;
    const {
      params
    } = that.data;
    params.offset = 0;
    that.setData({
      refresh: true,
      list: [],
      params
    })
    that.getList();
  },
  onShareAppMessage() {
    return {
      title: "甄火机械网",
      path: `/pages/index/index?invite_user_id=${getStorage('userid')}`,
      imageUrl: "https://cdn.eithergo.com/image/2024-03-28/1_w_660_h_528_1711595620_6fbb.jpg"
    }
  },
  onShareTimeline() {
    return {
      title: "甄火机械网",
      path: `/pages/index/index?invite_user_id=${getStorage('userid')}`,
      imageUrl: "https://cdn.eithergo.com/image/2024-03-28/1_w_660_h_528_1711595620_6fbb.jpg"
    }
  },

})