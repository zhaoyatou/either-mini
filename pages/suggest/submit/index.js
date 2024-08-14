import wxs from "../../../utils/wxs"
import {
  goBack,
  isLogin,
  toast
} from "../../../utils/utilities"
import {
  getUserInfo
} from "../../../utils/userInfo"
import {
  getImageInfo
} from "../../../utils/getImageInfo"
Page({

  data: {
    list: [],
    suggestImage: [],
    advice: '',
    images: [],
  },

  onShow() {
    let that = this;
    getUserInfo((userinfo) => {
      that.setData({
        userinfo,
      })
    })
    that.getList();
  },

  getList() {
    let that = this;
    wxs.request({
      url: `api/v1/self/advices`
    }).then((data) => {
      that.setData({
        list: data.data
      })
    })
  },
  changeAdvice(e) {
    let that = this;
    const {
      value: advice
    } = e.detail;
    that.setData({
      advice
    })
  },
  async submit() {
    let that = this;
    const {
      suggestImage,
    } = that.data;

    that.setData({
      images: (await getImageInfo(suggestImage)),
    })
    that.publish()
  },
  publish() {
    let that = this;
    const {
      advice,
      images
    } = that.data;
    wxs.request({
      url: 'api/v1/self/advice',
      method: "post",
      data: {
        advice,
        images
      }
    }).then(({
      data
    }) => {
      toast("发布成功...")
      setTimeout(() => {
        goBack();
      }, 500)
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
})