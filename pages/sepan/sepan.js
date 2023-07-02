Page({
    data: {
      color: 'rgb(0,0,0)'
    },
    onLoad: function() {
  
    },
    onReady: function() {
      //默认状态不需要设置
      this.colorPicker = this.selectComponent('#picker');
      this.setData({
        size: this.colorPicker.rpx2px(450),
        left: this.colorPicker.rpx2px(150),
        top: this.colorPicker.rpx2px(150)
      })
    },

    selectColor: function(e) {
      var that = this;
      //console.log(e.detail);
      that.setData({
        color: e.detail.rgb
      })
    },

    copy(){
        wx.setClipboardData({
            data: this.data.color,
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