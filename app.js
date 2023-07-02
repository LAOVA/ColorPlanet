// app.js
App({
  onLaunch() {
    wx.cloud.init({
        env:"cloud1-7gbgczki4ec15478"
      })
  },
  globalData: {
    userInfo: null,
    openid: null
  }
})
