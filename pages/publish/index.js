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
  getImageInfo
} from "../../utils/getImageInfo"

const app = getApp();
Page({

  data: {
    rect: app.globalData.rect,
    region: [],
    sortList: [],
    sortIndex: [],
    typeList: [{
      label: '全新',
      value: 1
    }, {
      label: '二手',
      value: 2
    }, {
      label: '求购',
      value: 3
    }],
    typeIndex: '',
    coverImage: [],
    detailsImage: [],
    degreeArr: ['九成新', '八成新', '七成新', '六成新', '五成新', '四成新', '三成新', '二成新', '一成新'],
    loginConfirmSwitch: false,
    ruleSwitch: false,
    issueSwitch: false,
    categoryName: "",
    product: {
      categoryId: "",
      name: "",
      boughtAt: "",
      degreeType: 1,
      address: "",
      brief: "",
      carriage: "",
      degree: 0,
      linkerMobile: "",
      price: "",
      city: "",
      tags: "",
    },
    amendId: '',
    isInRelease: false,
  },
  onLoad() {
    let that = this;
    const rect = wx.getMenuButtonBoundingClientRect();
    that.setData({
      rect
    })

    const {
      amendId
    } = app.globalData;

    if (amendId) {
      that.setData({
        amendId
      })
      app.globalData.amendId = "";
      that.getMarketDetail();
    } else {
      that.cleatProduct();
    }

    wx.subPub.listen('upMyProduct', (amendId) => {
      if (amendId) {
        that.setData({
          amendId
        })
        app.globalData.amendId = "";
        that.getMarketDetail();
      } else {
        that.cleatProduct();
      }

    });

  },
  onShow() {
    let that = this;
    that.getTabBar().setData({
      selected: 2
    });
    if (isLogin()) {
      getUserInfo((userinfo) => {
        that.setData({
          userinfo,
          region: [],
          ['product.linkerMobile']: userinfo.mobile,
          ['product.city']: userinfo.city
        })
      })
    }

    wxs.request({
      url: "api/v1/machine/category/top/list",
    }).then(({
      data: categoryTopList
    }) => {
      wxs.request({
        url: `api/v1/machine/category/${categoryTopList[0].id}/child/list`
      }).then(({
        data: categoryChildList
      }) => {
        this.setData({
          sortList: [categoryTopList, categoryChildList]
        })
      })

    })
  },
  cleatProduct() {
    let that = this;
    that.setData({
      product: {
        categoryId: "",
        name: "",
        boughtAt: "",
        degreeType: 1,
        address: "",
        brief: "",
        carriage: "",
        degree: 0,
        linkerMobile: "",
        price: "",
        city: "",
        tags: "",
      },
      categoryName: "",
      coverImage: [],
      detailsImage: [],
      region: [],
      amendId: '',
      issueSwitch: false,
      isInRelease: false
    })
  },
  inputChange(e) {
    const {
      name
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;
    this.setData({
      [name]: value
    })
  },
  bindMultiPickerChange(e) {
    let that = this;
    const {
      sortList
    } = that.data;
    const value = e.detail.value;
    that.setData({
      sortIndex: value,
      categoryName: sortList[1][value[1]].name,
      ['product.categoryId']: sortList[1][value[1]].id
    })
  },
  bindMultiPickerColumnChange: async function (e) {
    const data = {
      sortList: this.data.sortList,
      sortIndex: this.data.sortIndex,
    };
    if (!e.detail.column) {
      let childId = data.sortList[0][e.detail.value].id;
      let result = await wxs.request({
        url: `api/v1/machine/category/${childId}/child/list`
      })
      data.sortList[1] = result.data;
      data.sortIndex[1] = 0;
    }
    data.sortIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  changeType(e) {
    const {
      product
    } = this.data;
    this.setData({
      product: {
        ...product,
        degreeType: Number(e.currentTarget.dataset.value)
      }
    })
  },
  bindPickerChangeDegree(e) {
    const {
      product
    } = this.data;
    this.setData({
      product: {
        ...product,
        degree: e.detail.value
      }
    })
  },
  bindRegionChange(e) {
    let that = this;
    const {
      product
    } = that.data;
    that.setData({
      region: e.detail.value,
      product: {
        ...product,
        city: e.detail.value[1]
      }
    })
  },
  bindDateChangeBoughtAt(e) {
    const {
      product
    } = this.data;
    this.setData({
      product: {
        ...product,
        boughtAt: e.detail.value
      }
    })
  },
  selectPic(e) {
    let that = this;
    const {
      image,
      length
    } = e.currentTarget.dataset;
    wx.chooseImage({
      count: length - that.data[image],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        res.tempFiles.map(item => {
          if (item.size <= 0) {
            toast("图片不能为空");
            return;
          }
        })
        let list = [];
        res.tempFilePaths.map(item => {
          list.push({
            "src": item
          });
        })
        this.setData({
          [image]: this.data[image].concat(list)
        })
      }
    })
  },
  delete(e) {
    const {
      index,
      image
    } = e.currentTarget.dataset;
    let list = this.data[image];
    list.splice(index, 1);
    this.setData({
      [image]: list,
    })
  },
  commit() {
    let that = this;
    if (!isLogin()) {
      that.setData({
        loginConfirmSwitch: true, //  提示去登录的 弹窗
      })
      return;
    }
    if (!that.data.userinfo.mobile) {
      confirm({
        title: "提示",
        content: "请先绑定手机号",
        success: () => {
          wx.switchTab({
            url: `/pages/mine/index`,
          })
        }
      })
      return
    }
    const {
      coverImage,
      detailsImage,
    } = that.data;
    if (!coverImage.length) {
      toast("请上传图片")
      return
    }
    that.setData({
      issueSwitch: true
    })
  },
  async submit() {
    let that = this;
    const {
      coverImage,
      detailsImage,
      isInRelease
    } = that.data;
    if (isInRelease) {
      return
    }
    wx.showLoading({
      title: '发布中～',
      mask: true,
    })
    that.setData({
      isInRelease: true,
      ['product.cover']: (await getImageInfo(coverImage))[0],
      ['product.images']: await getImageInfo(detailsImage),
    })
    that.publish()
  },
  publish() {
    wx.requestSubscribeMessage({
      tmplIds: ['Aqzai1zFiPNrsJ-g3W-jbEC9a0tTHtJ0awgY7eeCUpI', 'C1FrPQ2FVB8fFdx6NYQYipKIOkXputYcnoXP6jNu1CI'],
    })
    this.data.amendId == '' ? this.creMarket() : this.upMarket()
  },
  upMarket() {
    let that = this;
    const {
      product
    } = that.data;
    wxs.request({
      url: `api/v1/market/machine/${that.data.amendId}/update`,
      method: "post",
      data: product
    }).then(({
      data
    }) => {
      wx.hideLoading();
      toast("发布成功...")
      that.cleatProduct();
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/myCart/index`,
        })
      }, 500)
    }).catch(() => {
      this.setData({
        isInRelease: false
      })
    })
  },
  creMarket() {
    let that = this;
    const {
      product
    } = that.data;
    wxs.request({
      url: 'api/v1/market/machine/create',
      method: "post",
      data: product
    }).then(({
      data
    }) => {
      wx.hideLoading();
      toast("发布成功...")
      that.cleatProduct()
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/myCart/index`,
        })
      }, 500)
    }).catch(() => {
      this.setData({
        isInRelease: false
      })
    })
  },
  getMarketDetail() {
    let that = this;
    wxs.request({
      url: `api/v1/market/machine/${that.data.amendId}`
    }).then((data) => {
      let {
        categoryName,
        city: region,
        name,
        degreeType,
        tags,
        linkerMobile,
        price,
        carriage,
        address,
        brief,
        cover,
        images,
        banners,
        categoryId,
        boughtAt,
        degree
      } = data.data;

      let coverImage = [];
      [cover].map((i) => {
        coverImage.push({
          src: i
        })
      })
      let detailsImage = [];
      images.map((i) => {
        detailsImage.push({
          src: i
        })
      })

      that.setData({
        product: {
          name,
          degreeType,
          tags,
          linkerMobile,
          price,
          carriage,
          address,
          brief,
          categoryId,
          city: region,
          boughtAt,
          degree
        },
        categoryName,
        coverImage: coverImage,
        detailsImage: detailsImage,
        region: ['', region]
      })
    })
  },
  hideConfirm() {
    this.setData({
      loginConfirmSwitch: false,
    })
  },
  sure() {
    this.setData({
      loginConfirmSwitch: false,
    })
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  hideRule() {
    this.setData({
      ruleSwitch: !this.data.ruleSwitch
    })
  },
  hideIssue() {
    this.setData({
      issueSwitch: false
    })
  },
  getPhoneNumber(e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let mobile_code = e.detail.code;
      that.lastStep({
        mobile_code: mobile_code,
      })
    }
  },
  lastStep(obj) {
    let that = this;
    wxs.request({
      url: `api/v1/auth/mini/bind/mobile`,
      method: 'post',
      data: {
        miniMobileCode: obj.mobile_code,
      },
    }).then(res => {
      if (res.code == 1) {
        toast("保存成功")
        getUserInfo((userinfo) => {
          that.setData({
            ['product.linkerMobile']: userinfo.mobile,
            userinfo,
          })
        })
      } else {
        toast(res.message);
      }
    })
  },
})