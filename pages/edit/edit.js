// pages/edit/edit.js
import {
    hexToRgb,
    rgbToHex,
    //saveBlendent
} from '../../utils/util.js'

var openid = ''
var localId = ''
var colorsList = []

Page({

    /**
     * 页面的初始数据
     */
    data: {
        blendent: {}, //存储配色
        selected: 0,
        r: 100,
        g: 0,
        b: 0,
        type:'',
        name:'未命名'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        openid = wx.getStorageSync('openid');
        localId = wx.getStorageSync('localId');
        let blendent = JSON.parse(options.blendent);
        this.setData({
            type: options.type
        })
        let rgb = hexToRgb(blendent.colors[0]);
       
        let {
            r,
            g,
            b
        } = rgb;
        this.setData({
            blendent,
            r,
            g,
            b
        });
    },


    onColorSelected: function (e) {
        //console.log(e)
        let selected = e.target.dataset.index;
        let rgb = hexToRgb(this.data.blendent.colors[selected]);
        let {
            r,
            g,
            b
        } = rgb;
        //console.log(rgb)
        this.setData({
            selected,
            r,
            g,
            b
        })
    },


    onChange: function (e) {
        let colorType = e.target.dataset.type;
        let num = Math.round(e.detail / 100 * 255);
        this.data[colorType] = num;
        let {
            r,
            g,
            b,
            blendent,
            selected
        } = this.data;
        let hex = rgbToHex(r, g, b);
        blendent.colors[selected] = '#' + hex;
        this.setData({
            blendent,
            r,
            g,
            b
        });
    },

    checkColors() {
        wx.request({
            url: 'http://localhost:3000/api/usersWH',
            method: 'POST',
            data: {
                _openid: openid
            },
            success: res => {
                console.log(res)
                colorsList = res.data[0].colors
                this.save(colorsList)
            }
        })
    },

    save(List) {
        var newColor = {}
        newColor.Name = this.data.name
        newColor.HEX = this.data.blendent.colors
        console.log('newColor.HEX',this.data.blendent)
        newColor.RGB = null
        newColor.Type = this.data.type
        List.push(newColor)
        console.log('新增记录：', List)

        wx.request({
            url: 'http://localhost:3000/api/updateColor',
            method: 'POST',
            data: {
                colors: List,
                id: localId
            },
            success: res => {
                console.log(res)
                wx.showToast({
                    title: '保存成功！',
                    icon: 'success'
                })
            }
        })

    },

    //点击复制颜色
    copy() {
        wx.setClipboardData({
            data: JSON.stringify(this.data.blendent.colors), //将json数据转为字符串
            success: function (res) {
                wx.showToast({
                    title: '颜色复制成功',
                    icon: 'success'
                })
            }
        })
    },

    //输入框
    input(e){
        this.setData({
            name: e.detail.value
        })
    },
})