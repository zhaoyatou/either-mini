Page({

  data: {

  },

  onShow() {

  },

  longPress(e) {
    const {
      src
    } = e.currentTarget.dataset;
    wx.scanCode({
      scanType: ['qrCode'],
    })
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: '17812061710'
    })
  },

})