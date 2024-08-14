// custom-tab-bar/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    list: [{
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/images/tab/home.png",
        "selectedIconPath": "/images/tab/home_selete.png"
      },
      {
        "pagePath": "/pages/sort/index",
        "text": "分类",
        "iconPath": "/images/tab/sort.png",
        "selectedIconPath": "/images/tab/sort_selete.png"
      },
      {
        "pagePath": "/pages/publish/index",
        "text": "发布",
        "iconPath": "/images/tab/fabu.png",
        "selectedIconPath": "/images/tab/fabu_selete.png"
      },
      {
        "pagePath": "/pages/product/index",
        "text": "商品",
        "iconPath": "/images/tab/shangpin.png",
        "selectedIconPath": "/images/tab/shangpin_selete.png"
      },
      {
        "pagePath": "/pages/mine/index",
        "text": "个人中心",
        "iconPath": "/images/tab/wode.png",
        "selectedIconPath": "/images/tab/wode_selete.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      let index = +e.currentTarget.dataset.index;
      let obj = this.data.list[index];
      wx.subPub.trigger('upMyProduct', "");
      wx.switchTab({
        url: obj.pagePath,
      });
    },
    onTabItemTap(item) {
      console.log(item)

      wx.showToast({
        title: 'tab点击',
      })

    }
  }
})