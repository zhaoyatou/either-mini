import {
  getStorage,
  romSrotage
} from "../../utils/utilities";

// components/dataItem/dataitem.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    },
    noCorporation: {
      type: Boolean,
      value: true
    }
  },
  pageLifetimes: {
    show() {
      let that = this;
      const {
        item
      } = that.data;
      const favoriteItem = getStorage('favoriteItem') || {};
      if (favoriteItem.id && item.id == favoriteItem.id) {
        item.favorites = favoriteItem.favorites;
        that.setData({
          item
        })
        romSrotage("favoriteItem")
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetil(e) {
      const {
        id
      } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/detail/index?id=${id}`
      })
    },

    goCorporation(e) {
      const {
        id
      } = e.currentTarget.dataset;
      const {
        noCorporation
      } = this.properties;
      console.log(noCorporation)
      noCorporation && wx.navigateTo({
        url: `/pages/corporation/index?id=${id}`
      })
    }
  }
})