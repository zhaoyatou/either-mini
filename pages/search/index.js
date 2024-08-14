import {
  goBack,
  getStorage,
  setStorage,
  confirm
} from "../../utils/utilities"
import {
  removeRepeat
} from "../../utils/util"
import wxs from '../../utils/wxs'
const app = getApp();
Page({
  goBack,
  data: {
    banner: [],
    placehoder: '请输入关键字',
    keyword: '',
    totalCount: 0,
    hotKeywords: [],
    typeIndex: 0,
    region: [],
    categoryName: '',
  },
  onLoad() {
    let that = this;
    wxs.request({
      url: `api/v1/website/hot/keywords`
    }).then(({
      data: hotKeywords
    }) => {
      that.setData({
        hotKeywords,
        getSearch: getStorage('searchData')
      })
    })
  },
  onShow() {
    this.getBanner();
  },
  setSearchStorage(e) {
    const keyStr = e.detail.value;
    if (!!!keyStr) {
      wx.showToast({
        title: '请输入关键字',
        icon: "none"
      })
      return;
    }
    this.searchSecondStage(keyStr);
  },
  clickKeySearch: function (e) {
    var keyStr = e.currentTarget.dataset.keystr;
    this.searchSecondStage(keyStr);
  },
  searchSecondStage(keyStr) {
    const that = this;
    that.setData({
      keyword: keyStr,
      showClear: true
    })
    that.setData({
      pageRequestHasNoData: true,
    })
    that.setData({
      page: 0,
    })
    var searchData = getStorage('searchData') || [];
    searchData.push(keyStr);
    searchData = removeRepeat(searchData)
    setStorage('searchData', searchData)
    that.setData({
      getSearch: searchData,
      currentSearchKey: keyStr,
    });
    app.globalData.searchProduct = {
      srarchName: keyStr,
    };
    wx.subPub.trigger('searchProduct', {
      srarchName: keyStr
    });
    wx.switchTab({
      url: `/pages/product/index`,
    })
  },

  clearSearchStorage: function () {
    var that = this;
    confirm({
      title: "是否清空历史搜索",
      success: function (res) {
        if (res.confirm) {
          setStorage('searchData', [])
          that.setData({
            getSearch: []
          })
        }
      }
    })
  },


  getBanner() {
    let that = this;
    wxs.request({
      url: 'api/v1/website/banners',
    }).then(({
      data
    }) => {
      that.setData({
        banner: data.filter(i => i.position === 4)[0].banners,
      })
    })
  },


})