// pages/user/user.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp()
var openid = ''

Page({

    data: {
        userInfo: {},
        haslogined: false,
        openid: ''
    },

    onLoad() {
        //展示用户的本地缓存信息
        console.log('进入小程序个人界面')
        let user = wx.getStorageSync('user')
        let openid = wx.getStorageSync('openid')
        app.globalData.userInfo = user
        app.globalData.openid = openid
        console.log('app用户缓存信息：', app.globalData.userInfo)
        this.setData({
            userInfo: user,
            openid: openid

        })
    },

    login() {
        openid = wx.getStorageSync('openid')
        if (!openid) {
            wx.login({
                success: result => {
                    wx.request({
                        url: 'http://localhost:3000/api/login',
                        data: {
                            code: result.code
                        },
                        success: res => {
                            openid = res.data.openid
                            wx.setStorageSync('openid', openid)
                        }
                    })
                }
            })
        }

        //微信授权
        wx.getUserProfile({
            desc: '展示用户信息', //提示框
            success: res => {
                var user = res.userInfo
                app.globalData.userInfo = user
                wx.setStorageSync('user', user) //将用户信息存入本地
                this.setData({
                    userInfo: user,
                })

                if (openid) {
                    wx.login({
                        success: result => {
                            wx.request({
                                url: 'http://localhost:3000/api/usersWH',
                                method: 'POST',
                                data: {
                                    _openid: openid
                                },
                                success: res => {
                                    console.log(res)
                                    if(res.data.length!=0){
                                        this.check(res.data.length, res.data[0]._id)
                                    }else{
                                        this.check(0, null)
                                    }
                                    
                                }
                            })
                        }
                    })
                }
            }
        })
    },


    check(n, id) {
        //检查用户是否已经登录过

        if (n == 0) {
            wx.request({
                url: 'http://localhost:3000/api/addUser',
                method: 'POST',
                data: {
                    _openid: openid,
                    colors: []
                },
                success: res => {
                    wx.setStorageSync('localId', res.data._id)
                    wx.showToast({
                        title: '新用户登录成功',
                    })
                }
            })
        } else {
            wx.setStorageSync('localId', id)
            wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1000
            })

        }
    },

    logout() {
        this.setData({
            userInfo: ''
        })
        wx.setStorageSync('user', null)
        wx.setStorageSync('localId', null)
        wx.setStorageSync('openid', null)

    },

    ifLogout() {
        Dialog.confirm({
                title: '温馨提示',
                message: '是否退出登录',
            })
            .then(() => {
                this.logout()
            })
            .catch(() => {
                // on cancel
            });
    },

    toCollection(){
        wx.navigateTo({
          url: './collection/collection',
        })
    },

    onShow() {
        this.tabBar()
    },

    tabBar() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
    },




    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})