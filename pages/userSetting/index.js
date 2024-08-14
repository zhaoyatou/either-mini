import wxs from "../../utils/wxs";
import {
  getUserInfo
} from "../../utils/userInfo";
import {
  getImageInfo
} from "../../utils/getImageInfo";
import {
  goBack,
  toast
} from "../../utils/utilities";
const app = getApp()
Page({

  data: {
    userinfo: {},
    userAvatar: '',
    city: [],
    linker: "",
    wxAccount: "",
    qqAccount: "",
    address: "",
  },
  onLoad() {},
  onShow() {
    let that = this;
    getUserInfo((userinfo) => {
      that.setData({
        userinfo,
        city: [],

        linker: userinfo.linker,
        wxAccount: userinfo.wxAccount,
        qqAccount: userinfo.qqAccount,
        address: userinfo.address,
      })
    })
  },
  async upAvatar(e) {
    let that = this;
    const {
      image,
    } = e.currentTarget.dataset;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
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
          userAvatar: (await getImageInfo(list))[0]
        })
      }
    })
  },
  bindRegionChange(e) {
    let that = this;
    that.setData({
      city: e.detail.value
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
  save() {
    let that = this;
    const {
      city,
      userAvatar: avatar,
      linker,
      wxAccount,
      qqAccount,
      address,
      userinfo
    } = that.data;
    wxs.request({
      url: `api/v1/self/info`,
      method: "post",
      data: {
        city: city.length ? city[1] : userinfo.city,
        avatar,
        linker,
        wxAccount,
        qqAccount,
        address,
      }
    }).then(() => {
      toast("保存成功")
      setTimeout(() => {
        goBack()
      }, 500)
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
})