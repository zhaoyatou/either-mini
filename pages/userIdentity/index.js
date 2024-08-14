import wxs from "../../utils/wxs"
import {
  goBack,
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
    type: 0,
    // 公司名称
    companyName: '',
    // 公司介绍
    brief: '',
    // 营业执照
    businessLicense: '',
    businessLicenseImage: [],
    // 法人身份证(正面)
    identityCard: '',
    identityCardImage: [],
    // 公司照片
    photos: [],
    photosImage: [],
  },

  onLoad(options) {
    let that = this;
    that.setData({
      type: options.type
    })
    if (that.data.type == 1) {
      that.getIdentity();
    }
  },
  onShow() {
    let that = this;
    const rect = wx.getMenuButtonBoundingClientRect();
    that.setData({
      rect
    })
    if (isLogin()) {
      getUserInfo((userinfo) => {
        that.setData({
          userinfo,
        })
      })
    }
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
        that.setData({
          [image]: that.data[image].concat(list)
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
  // 获取认证信息
  getIdentity() {
    let that = this;
    if (isLogin()) {
      wxs.request({
        url: `api/v1/self/identity`
      }).then(({
        data
      }) => {
        const {
          companyName,
          brief,
          // 营业执照
          businessLicense,
          // 法人身份证(正面)
          identityCard,
          // 公司照片
          photos,
        } = data;
        let photosImage = [];
        photos.map((i) => {
          photosImage.push({
            src: i
          })
        })
        that.setData({
          companyName,
          brief,
          businessLicenseImage: [{
            src: businessLicense
          }],
          identityCardImage: [{
            src: identityCard
          }],
          photosImage
        })
      })
    }
  },
  async submit() {
    let that = this;
    if (!isLogin()) {
      that.setData({
        loginConfirmSwitch: true, //  提示去登录的 弹窗
      })
      return;
    }
    const {
      businessLicenseImage,
      identityCardImage,
      photosImage,
      companyName
    } = that.data;
    if (!businessLicenseImage.length || !identityCardImage.length) {
      toast("请上传图片")
      return
    }
    if (!companyName) {
      toast("请添加公司名称")
      return
    }
    that.setData({
      ['businessLicense']: (await getImageInfo(businessLicenseImage))[0],
      ['identityCard']: (await getImageInfo(identityCardImage))[0],
      ['photos']: (await getImageInfo(photosImage)),
    })
    that.publish()
  },
  publish() {
    let that = this;
    const {
      businessLicense,
      identityCard,
      photos,
      companyName,
      brief
    } = that.data;
    wxs.request({
      url: 'api/v1/self/identity',
      method: "post",
      data: {
        businessLicense,
        identityCard,
        photos,
        companyName,
        brief
      }
    }).then(({
      data
    }) => {
      toast("发布成功...")
      wx.requestSubscribeMessage({
        tmplIds: ['MjhHIH9Ewy7jwxoOpw9ck_cRZUc6z3UiUfufvnOJXgY'],
      })
      setTimeout(() => {
        goBack()
      }, 700)
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
})