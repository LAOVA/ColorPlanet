
const util = require('../../utils/util.js')
let colorPickerCtx = {};
let sliderCtx = {};
let _this = null
Page({
  data: {
    pickColor: null,
    raduis: 600, //这里最大为750rpx铺满屏幕
    valueWidthOrHerght: 0
  },

  onLoad: function() {
    _this = this
    colorPickerCtx = wx.createCanvasContext('colorPicker');
    colorPickerCtx.fillStyle = '#e0e0e0';
    sliderCtx = wx.createCanvasContext('colorPickerSlider');

    let isInit = true;
    wx.createSelectorQuery().select('#colorPicker').boundingClientRect(function(rect) {
      _this.setData({
        valueWidthOrHerght: rect.width,
      })
      if(isInit){
        colorPickerCtx.fillRect(0, 0, rect.width, rect.height);
        util.drawRing(colorPickerCtx, rect.width, rect.height);
        // 设置默认位置
        util.drawSlider(sliderCtx, rect.width, rect.height, 1.0);
        isInit = false;
      }
      
      _this.setData({
        pickColor: JSON.stringify({
          red: 255,
          green: 0,
          blue: 0
        })
      })
    }).exec();
  },

  onClickRedColor: function() {
    let h = util.rgbToHsl(255, 0, 0);
    util.drawSlider(sliderCtx, _this.data.valueWidthOrHerght, _this.data.valueWidthOrHerght, h[0]);

    this.setData({
      pickColor: JSON.stringify({
        red: 255,
        green: 0,
        blue: 0
      })
    })
  },

  onClickGreenColor: function() {
    let h = util.rgbToHsl(0, 255, 0);
    util.drawSlider(sliderCtx, _this.data.valueWidthOrHerght, _this.data.valueWidthOrHerght, h[0]);
    this.setData({
      pickColor: JSON.stringify({
        red: 0,
        green: 255,
        blue: 0
      })
    })
  },

  onClickBlueColor: function() {
    let h = util.rgbToHsl(0, 0, 255);
    util.drawSlider(sliderCtx, _this.data.valueWidthOrHerght, _this.data.valueWidthOrHerght, h[0]);
    this.setData({
      pickColor: JSON.stringify({
        red: 0,
        green: 0,
        blue: 255
      })
    })
  },
  
  onSlide: function(e) {
    let that = this;
    if (e.touches && ( e.type === 'touchend')) {
      let x = e.changedTouches[0].x;
      let y = e.changedTouches[0].y;
      if (e.type !== 'touchend') {
        x = e.touches[0].x;
        y = e.touches[0].y;
      }
      //复制画布上指定矩形的像素数据
      wx.canvasGetImageData({
        canvasId: "colorPicker",
        x: x,
        y: y,
        width: 1,
        height: 1,
        success(res) {
          // 转换成HSL格式，获取旋转角度
          let h = util.rgbToHsl(res.data[0], res.data[1], res.data[2]);
          that.setData({
            pickColor: JSON.stringify({
              red: res.data[0],
              green: res.data[1],
              blue: res.data[2]
            })
          })
          
          let outRgb = 'rgb(' + res.data[0] + ',' +  res.data[1] + ','  + res.data[2] + ')' 
          //console.log(outRgb)

          // 判断是否在圈内
          if (h[1] != 1.0) {
            _this.setData({
                pickColor: JSON.stringify({
                  red: 255,
                  green: 0,
                  blue: 0
                })
              })
          }
          util.drawSlider(sliderCtx, _this.data.valueWidthOrHerght, _this.data.valueWidthOrHerght, h[0]);
          // 设置设备
          if (e.type !== 'touchEnd') {
            // 触摸结束才设置设备属性
            return;
          }
        }
      });
    }
  },

  copy(){
    wx.setClipboardData({
        data: this.data.pickColor,
        success: function (res) {
            wx.showToast({
                title: '颜色复制成功',
                icon: 'success'
            })
        },
        fail:err=>{
            console.log(err)
        }
    })
},

})