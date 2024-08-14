import wxs from "../../utils/wxs"
import {
  linkRevert
} from '../../utils/pathurl';
const {
  getList,
  searchList,
  getMore
} = require('../../utils/searchList')
// 获取应用实例
const app = getApp()

Page({
  data: {
    rect: app.globalData.rect,
    totalCount: 0,
    typeIndex: 0,
    region: [],
    banner: [],
    categoryName: '',
    params: {
      offset: 0,
      limit: 20,
      name: "",
      sort: 2,
    },
    list: [],
    refresh: false,
  },
  onLoad() {
    let that = this;
    const rect = wx.getMenuButtonBoundingClientRect();
    that.setData({
      rect
    })
    that.getBanner();
    wx.subPub.listen('searchProduct', ({
      srarchName,
      categoryName,
      categoryId,
      degreeType,
      city
    }) => {
      that.setData({
        typeIndex: degreeType,
        region: city,
        categoryName: categoryName,
        list: [],
        ['params.name']: srarchName || '',
        ['params.city']: city || '',
        ['params.degreeType']: degreeType || '',
        ['params.categoryId']: categoryId || '',
        ['params.offset']: 0,
      })
      that.getList();
    })
    const {
      srarchName,
      categoryName,
      categoryId,
      degreeType,
      city
    } = app.globalData.searchProduct;
    const {
      params
    } = that.data;
    that.setData({
      typeIndex: degreeType,
      region: city,
      categoryName: categoryName,
      list: [],
      ['params.name']: srarchName || '',
      ['params.city']: city || '',
      ['params.degreeType']: degreeType || '',
      ['params.categoryId']: categoryId || '',
      ['params.offset']: 0,
    })
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
    let that = this;
    that.getTabBar().setData({
      selected: 3
    });


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
    params.offset = 0;
    city && (params.city = city)
    degreeType && (params.degreeType = degreeType)
    categoryId && (params.categoryId = categoryId)
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
  getBanner() {
    let that = this;
    wxs.request({
      url: 'api/v1/website/banners',
    }).then(({
      data
    }) => {
      that.setData({
        banner: data.filter(i => i.position === 5)[0].banners,
      })
    })
  },
  setSearchStorage(e) {
    let that = this;
    app.globalData.productName = "";
    const keyStr = e.detail.value;
    that.setData({
      ['params.name']: keyStr,
      ['params.offset']: 0,
      list: [],
    })
    that.getList();
  },
  preview(e) {
    const {
      item
    } = e.currentTarget.dataset;
    if (item.targetUrl) {
      wx.navigateTo({
        url: linkRevert(item.targetUrl)
      })
    }
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
  }
})