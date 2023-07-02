// pages/user/collection/collection.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'

var openid = ''
var localId = ''
var checkToast = false

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ColorsList: [], //存储配色
        longtap: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(checkToast == false){
            Toast('点击复制颜色值，长按取消收藏');
        }
        
        openid = wx.getStorageSync('openid');
        localId = wx.getStorageSync('localId');
        wx.request({
            url: 'http://localhost:3000/api/usersWH',
            method: 'POST',
            data: {
                _openid: openid
            },
            success: res => {
                console.log(res)

                this.setData({
                    ColorsList: res.data[0].colors
                })

            }
        })
    },

    //点击复制颜色
    copy(e) {
        if (this.data.longtap == false) {
            wx.setClipboardData({
                data: JSON.stringify(e.currentTarget.dataset.colors), //将json数据转为字符串
                success: function (res) {
                    wx.showToast({
                        title: '颜色复制成功',
                        icon: 'success'
                    })
                },
                fail: err => {
                    console.log(err)
                }
            })
        }

    },

    //删除色卡
    deleta(id) {
        console.log('删除')
        var newColor = this.data.ColorsList
        newColor.splice(id,1)
        console.log(newColor)
        wx.request({
            url: 'http://localhost:3000/api/updateColor',
            method: 'POST',
            data: {
                colors: newColor,
                id: localId
            },
            success: res => {
                checkToast = true
                this.setData({
                    longtap: false
                })
                wx.showToast({
                    title: '删除成功！',
                    icon: 'success'
                })
                this.onLoad()
            }
        })
    },

    //确认
    check(e){
        console.log(e.currentTarget.dataset.id)
        this.setData({
            longtap: true
        })
        Dialog.confirm({
            title: '温馨提示',
            message: '是否确认取消收藏',
          })
            .then(() => {
                this.setData({
                    longtap: false
                })
                this.deleta(e.currentTarget.dataset.id)
            })
            .catch(() => {
                this.setData({
                    longtap: false
                })
            });
    },

    //回到顶部
    handleBackTop() {
        wx.pageScrollTo({
            scrollTop: 0,
        })
    },
})