export const goBack = () => {
  wx.navigateBack()
}
export const getStorage = (key) => {
  return wx.getStorageSync(key);
}
export const setStorage = (key, value) => {
  wx.setStorageSync(key, value);
}
export const romSrotage = (key) => {
  wx.removeStorageSync(key)
}
export const toast = (title) => {
  wx.showToast({
    title,
    icon: "none"
  })
}
export const confirm = params => {
  wx.showModal({
    title: params.title,
    content: params.content || '',
    confirmText: params.confirmText || '确定',
    cancelText: params.cancelText || '取消',
    success: params.success,
  })
}
export const isLogin = () => {
  return !!getStorage("accesstoken")
};
export const loginRemind = () => {
  let app = getApp();
  if (app.globalData.showRemind == true) {
    return;
  }
  app.globalData.showRemind = true;
  confirm({
    title: "提示",
    content: "需要登录才能进行后续操作",
    showCancel: true,
    cancelText: '不了',
    confirmText: "去登录",
    success: function (res) {
      if (res.confirm) {
        app.globalData.showRemind = false;
        wx.navigateTo({
          url: `/pages/login/index`
        });
      } else if (res.cancel) {
        app.globalData.showRemind = false;
      }
    }
  });
};