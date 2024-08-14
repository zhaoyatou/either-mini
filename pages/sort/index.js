import wxs from "../../utils/wxs";
const app = getApp();
Page({
  data: {
    categoryTopList: [],
    categoryChildList: [],
    activeId: '',
  },

  onShow() {
    this.getTabBar().setData({
      selected: 1
    });
    const {
      sortId
    } = app.globalData;
    this.getChildList(sortId)
    this.getCategoryTopList();
    this.getBanner();
  },
  getCategoryTopList() {
    wxs.request({
      url: "api/v1/machine/category/top/list",
    }).then(({
      data: categoryTopList
    }) => {
      this.setData({
        categoryTopList
      })
    })
  },
  changeCategory(e) {
    const {
      id
    } = e.currentTarget.dataset;
    this.getChildList(id)
  },
  getChildList(id) {
    this.setData({
      activeId: id
    })
    if (id) {
      wxs.request({
        url: `api/v1/machine/category/${id}/child/list`
      }).then(({
        data: categoryChildList
      }) => {
        this.setData({
          categoryChildList
        })
      })
    }
  },
  changeChildCategory(e) {
    const {
      item
    } = e.currentTarget.dataset;
    app.globalData.searchProduct = {
      categoryId: item.id,
      categoryName: item.name,
    };
    wx.subPub.trigger('searchProduct', {
      categoryId: item.id,
      categoryName: item.name,
    });
    wx.switchTab({
      url: `/pages/product/index`,
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
        banner: data.filter(i => i.position === 6)[0].banners,
      })
    })
  },
})