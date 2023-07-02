var bl = 0
var bgImg = ''
var ctx = wx.createCanvasContext('canvasIn', this);

function convertToGrayscale(data) {
    return data
}

Page({

    data: {
        W: 0,
        H: 0,
        x1: 0,
        y1: 0,
        RGB: {
            r: 0,
            b: 0,
            g: 0,
            a: 0
        },
    },


    onReady() {},

    openAndDraw() {
        const that = this

        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success(res) {
                //console.log(res.tempFiles[0].tempFilePath)
                wx.getImageInfo({
                    src: res.tempFiles[0].tempFilePath,
                    success: function (res) {
                        //console.log(res);
                        const w = res.width;
                        const h = res.height;
                        bl = w / h
                        //console.log(bl)
                        that.setData({
                            W: 300,
                            H: 300 / bl
                        })

                    }
                })
                wx.showLoading({
                    title: '图片加载中',
                })
                setTimeout(function () {
                    bgImg = res.tempFiles[0].tempFilePath
                    wx.hideLoading()
                    ctx.drawImage(bgImg, 0, 0, 300, 300 / bl)
                    ctx.draw()
                    ctx.save(); // 保存
                }, 1000)
            }
        })
    },

    GetPoint(e) {
        // this.setData({
        //     x1: e.changedTouches[0].x.toFixed(0),
        //     y1: e.changedTouches[0].y.toFixed(0)
        // })
        // this.process(this.data.x1, this.data.y1)
    },

    makeImg(e) {
        //console.log(e)
        this.setData({
            x1: e.changedTouches[0].x.toFixed(0),
            y1: e.changedTouches[0].y.toFixed(0)
        })
        this.process(this.data.x1, this.data.y1)
    },


    process(x, y) {
        ctx.drawImage(bgImg, 0, 0, 300, 300 / bl)
        ctx.draw()
        let that = this
        const cfg = {
            x: x * 1,
            y: y * 1,
            width: 1,
            height: 1,
        }
        //console.log(cfg)
        wx.canvasGetImageData({
            canvasId: 'canvasIn',
            ...cfg,
            success: (res) => {
                //console.log(res)
                that.setData({
                    'RGB.r': res.data[0],
                    'RGB.b': res.data[1],
                    'RGB.g': res.data[2],
                    'RGB.a': res.data[3]
                })
                if (cfg.x <= that.data.W && cfg.y <= that.data.H) {
                    if (that.data.W - cfg.x < 25 && that.data.H - cfg.y > 25) {
                        wx.canvasToTempFilePath({
                            x: cfg.x - (that.data.W - cfg.x) - 25,
                            y: cfg.y - 25,
                            width: 50,
                            height: 50,
                            canvasId: 'canvasIn',
                            success: function (res) {
                                if (cfg.x <= that.data.W) {
                                    that.setData({
                                        outImg: res.tempFilePath
                                    })
                                    that.drawDot(cfg.x, cfg.y)
                                }
                            }
                        })
                    } else if (that.data.W - cfg.x > 25 && that.data.H - cfg.y < 25) {
                        wx.canvasToTempFilePath({
                            x: cfg.x - 25,
                            y: cfg.y - (that.data.H - cfg.y) - 25,
                            width: 50,
                            height: 50,
                            canvasId: 'canvasIn',
                            success: function (res) {
                                that.setData({
                                    outImg: res.tempFilePath
                                })
                                that.drawDot(cfg.x, cfg.y)

                            }
                        })
                    } else if (that.data.W - cfg.x < 25 && that.data.H - cfg.y < 25) {
                        wx.canvasToTempFilePath({
                            x: cfg.x - (that.data.W - cfg.x) - 25,
                            y: cfg.y - (that.data.H - cfg.y) - 25,
                            width: 50,
                            height: 50,
                            canvasId: 'canvasIn',
                            success: function (res) {
                                that.setData({
                                    outImg: res.tempFilePath
                                })
                                that.drawDot(cfg.x, cfg.y)
                            }
                        })
                    } else {
                        wx.canvasToTempFilePath({
                            x: cfg.x - 25,
                            y: cfg.y - 25,
                            width: 50,
                            height: 50,

                            canvasId: 'canvasIn',
                            success: function (res) {

                                that.setData({
                                    outImg: res.tempFilePath
                                })
                                that.drawDot(cfg.x, cfg.y)

                            }
                        })
                    }
                }

            },
            fail: (err) => {
                console.error(err)
            }
        })

    },

    drawDot(x, y) {
        // 画背景图
        ctx.drawImage(bgImg, 0, 0, 300, 300 / bl)

        // 圆形位置 大小
        var x = x,
            y = y,
            size = 26;

        ctx.save(); // 保存
        ctx.beginPath(); // 开始绘制
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        ctx.clip();

        ctx.drawImage('/img/dot.png', 0, 0, 300, 300 / bl)

        // 恢复之前保存的绘图上下文
        ctx.restore();
        ctx.draw()
    },

    //点击复制颜色
    copy() {
        wx.setClipboardData({
            data: JSON.stringify(this.data.RGB), //将json数据转为字符串
            success: function (res) {
                wx.showToast({
                    title: '颜色复制成功',
                    icon: 'success'
                })
            }
        })
    },
})