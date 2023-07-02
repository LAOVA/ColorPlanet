import colorExtract from '../../utils/colorExtract.js'
import {
    rgbToHex
} from '../../utils/util.js'

var openid = ''
var localId = ''
var colorsList = []
var imgUrl = ''

Page({
    data: {
        imgPath: null,
        colors: [],
        imgInfo: {},
        colorCount: 7,
    },


    onLoad: function () {
        openid = wx.getStorageSync('openid')
        localId = wx.getStorageSync('localId')
        console.log(openid)
        console.log(localId)
        this.colorExtract = new colorExtract('imageHandler');
        // 获取屏幕宽度
        wx.getSystemInfo({
            success: ({
                screenWidth
            }) => {
                this.screenWidth = screenWidth;
            }
        })
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
        newColor.Name = '未命名'
        newColor.HEX = this.data.colors
        newColor.RGB = null
        newColor.Type = 'collocation'
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

    chooseImg: function () {
        //选择图片
        wx.chooseMedia({
            count: 1,
            mediaType: ['image', 'video'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success: (res) => {
                console.log(res)
                imgUrl = res.tempFiles[0].tempFilePath
                this.setData({
                    imgPath: imgUrl,
                })
                this.getColors()
            }
        })
    },

    reSet(e) {
        this.setData({
            colorCount: e.detail
        })
    },

    getColors() {
        wx.getImageInfo({
            src: imgUrl,
            success: (imgInfo) => {
                let {
                    width,
                    height,
                    imgPath
                } = imgInfo;
                let scale = 0.8 * this.screenWidth / Math.max(width, height);
                let canvasWidth = Math.floor(scale * width);
                let canvasHeight = Math.floor(scale * height);
                this.setData({
                    imgInfo,
                    canvasScale: scale,
                    canvasWidth,
                    canvasHeight
                });
                let quality = 1;
                console.log(quality);
                this.colorExtract.getPalette({
                    width: canvasWidth,
                    height: canvasHeight,
                    imgPath: imgUrl,
                    colorCount: this.data.colorCount,
                    quality
                }, (colors) => {
                    console.log(colors)
                    colors = colors.map((color) => {
                        return ('#' + rgbToHex(color[0], color[1], color[2]))
                    })

                    this.setData({
                        colors,
                    })
                });
            }
        })
    },

    edit() {
        if (this.data.colors.length != 0) {
            let blendent = {
                colors: this.data.colors
            };
            wx.navigateTo({
                url: '../edit/edit?blendent=' + JSON.stringify(blendent) + '&type=collocation',
            })
        }else{
            wx.showToast({
              title: '请先提取颜色',
              icon: 'error'
            })
        }
    },
})