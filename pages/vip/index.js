import {
  getUserInfo
} from "../../utils/userInfo"
import {
  formatDate
} from "../../utils/util";
Page({
  data: {
    vipList: [{
        image: 'https://cdn.eithergo.com/image/2024-03-18/1_w_981_h_516_1710757266_cfdf.jpg',
        btnTxt: "已获得",
        btnBgC: "#7E8CAA",
        isVip: true,
        rightsTit: '普通会员权益',
        rights: ['店铺服务', '免费上架2个商品']

      },
      {
        image: 'https://cdn.eithergo.com/image/2024-03-18/1_w_981_h_519_1710757323_344d.jpg',
        notBtnTxt: "去认证",
        btnTxt: "已认证",
        btnBgC: "#027AFF",
        isVip: false,
        rightsTit: "认证会员权益",
        rights: ['店铺服务', '免费上架5个商品']
      },
      {
        image: 'https://cdn.eithergo.com/image/2024-03-18/1_w_981_h_519_1710757338_c33e.jpg',
        notBtnTxt: "去开通",
        btnTxt: "已开通",
        btnBgC: "#F08700",
        expire: "点击个人中心-联系我们开通",
        isVip: false,
        rightsTit: "黄金会员权益",
        rights: ['店铺服务', '免费上架10个商品', '商品曝光值+10', '更多权益开放中']
      },
      {
        image: 'https://cdn.eithergo.com/image/2024-03-18/1_w_981_h_522_1710757354_d1f1.jpg',
        notBtnTxt: "去开通",
        btnTxt: "已开通",
        btnBgC: "#D75C36",
        expire: "点击个人中心-联系我们开通",
        isVip: false,
        rightsTit: "铂金会员权益",
        rights: ['店铺服务', '免费上架20个商品', '商品曝光值+25', '更多权益开放中']
      },
      {
        image: 'https://cdn.eithergo.com/image/2024-03-18/1_w_981_h_522_1710757378_4fcf.jpg',
        notBtnTxt: "去开通",
        btnTxt: "已开通",
        btnBgC: "#3650BF",
        expire: "点击个人中心-联系我们开通",
        isVip: false,
        rightsTit: "钻石会员权益",
        rights: ['店铺服务', '免费上架50个商品', '商品曝光值+60', '到期商品自动上架', '更多权益开放中']
      },
    ],
    vipLevel: 0,
  },

  onShow() {
    let that = this;
    const {
      vipList
    } = that.data;
    getUserInfo((userinfo) => {
      let vipLevel = 0;
      if (userinfo.identityState == 2) {
        vipList[1].isVip = true;
        that.setData({
          vipList,
          vipLevel: 1
        })
      }
      if (userinfo.userVip) {
        let vipLevel = userinfo.userVip.vipLevel + 1;
        vipList[vipLevel].isVip = true;
        vipList[vipLevel].expire = formatDate(userinfo.userVip.vipEndAt, 'yyyy-MM-dd hh:mm');
        that.setData({
          vipList,
          vipLevel
        })
      }
      that.setData({
        userinfo,
        swiperIndex: that.data.vipLevel
      })
    })
  },
  goTo(e) {
    const {
      index
    } = e.currentTarget.dataset;
    if (index == 1) {
      wx.navigateTo({
        url: `/pages/userIdentity/index`
      });
    } else {
      wx.navigateTo({
        url: `/pages/relationMe/index`
      });
    }
  },
  changeSwiperIndex(e) {
    let swiperIndex = e.detail.current
    this.setData({
      swiperIndex
    })
  }
})