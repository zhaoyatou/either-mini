import {
  formatDate
} from "../../utils/util";
import wxs from "../../utils/wxs"
const app = getApp();
Page({

  data: {
    array: ["注册用户", '付费用户'],
    totalCount: 0,
    list: [],
    userinfo: app.globalData.userinfo,
    params: {
      userId: '',
      showType: 1,
      showBegin: "",
      showEnd: "",
      offset: 0,
      limit: 20,
    }
  },
  onShow() {},
  getList() {
    let that = this;
    const {
      params,
      list
    } = that.data;
    wxs.request({
      url: `api/v1/self/list/invite/users`,
      data: params
    }).then((res) => {
      const {
        records,
        totalCount
      } = res.data;
      if (records.length) {
        params.offset += params.limit;
        that.setData({
          params
        })
      }
      records.map((i) => {
        i.registerTime = formatDate(i.registerTime)
        i.payTime = formatDate(i.payTime)
      })
      that.setData({
        list: [...list, ...records],
        totalCount
      })
      console.log(that.data.list)
    })
  },
  bindPickerChange(e) {
    let that = this;
    const {
      params
    } = that.data;
    let showType = Number(e.detail.value) + 1;
    that.setData({
      params: {
        ...params,
        showType
      }
    })
  },
  bindDateChange(e) {
    console.log(e)
    const {
      key
    } = e.target.dataset;
    this.setData({
      [key]: e.detail.value
    })
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
  search() {
    let that = this;
    const {
      params
    } = that.data;
    that.setData({
      list: [],
      params: {
        ...params,
        offset: 0
      }
    })
    that.getList();
    console.log(params)
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
  // 复制ID
  sopyId(e) {
    let that = this;
    const {
      id
    } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: String(id),
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  preview(e) {
    let urls = [this.data.userinfo.userInviter.miniCodeImage];
    wx.previewImage({
      urls,
      current: urls[0]
    })
  },
  onShareAppMessage() {
    const {
      userinfo,
    } = this.data;

    return {
      title: userinfo.nickname,
      imageUrl: userinfo.avatar,
      path: `/pages/index/index?invite_user_id=${userinfo.id}`
    }
  }
})