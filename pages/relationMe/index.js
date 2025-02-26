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
  previewImage() {
    wx.previewImage({
      current: 'https://cdn.firemachine.cn/image/2025-02-11/2_w_1062_h_2366_1739255896_b6a3.jpg', // 当前显示图片的链接
      urls: ['https://cdn.firemachine.cn/image/2025-02-11/2_w_1062_h_2366_1739255896_b6a3.jpg', 'https://cdn.firemachine.cn/image/2025-02-11/2_w_1058_h_2334_1739255924_1c19.jpg'] // 需要预览的图片链接列表（可添加多个URL以实现多张图片预览）
    });
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: '17812061710'
    })
  },

})