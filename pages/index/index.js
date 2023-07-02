// index.js
// 获取应用实例
const app = getApp()
var id = ''
var localId = ''
var openid = ''

Page({
    data: {
        userInfo: {},
        haslogined: false,
        openid: ''
    },

    onLoad() {
        //展示用户的本地缓存信息
        let user = wx.getStorageSync('user')
        let openid = wx.getStorageSync('openid')
        app.globalData.userInfo = user
        app.globalData.openid = openid
        //console.log('app用户缓存信息：', app.globalData.userInfo)
        this.setData({
            userInfo: user,
            openid: openid

        })
    },


    onShow() {
        this.tabBar()
    },


    toSeban() {
        wx.navigateTo({
            url: '/pages/seban/seban',
        })
    },

    toSehuan() {
        wx.navigateTo({
            url: '/pages/sehuan/sehuan',
        })
    },

    tocStyleColor() {
        wx.navigateTo({
            url: '/pages/cStyleColor/cStyleColor',
        })
    },

    tocMatching() {
        wx.navigateTo({
            url: '/pages/colorMatching/colorMatching',
        })
    },

    toTest4() {
        wx.navigateTo({
            url: '/pages/test4/test4',
        })
    },

    toSquare() {
        wx.navigateTo({
            url: '/pages/square/square',
        })
    },

    togColor() {
        wx.navigateTo({
            url: '/pages/gColor/gColor',
        })
    },

    toSepan() {
        wx.navigateTo({
            url: '/pages/sepan/sepan',
        })
    },

    tocC() {
        wx.navigateTo({
            url: '/pages/colorConvert/colorConvert',
        })
    },

    tocP() {
        wx.navigateTo({
            url: '/pages/colorPicker/colorPicker',
        })
    },



    tabBar() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
    },

    //展示窗口 
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    //隐藏窗口
    hideModal() {
        this.setData({
            modalName: null,
        })
    },
})