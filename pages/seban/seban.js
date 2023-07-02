// pages/test1/test1.js
Page({

    data:{
        rgb: 'rgb(0,0,0)',//初始值
        pick: false
      },

      // 调用组件，显示取色器
      toPick: function () {
        this.setData({
          pick: true
        })
      },

      //获取取色结果
      pickColor(e) {
        let rgb = e.detail.color;
        //console.log(rgb)
        this.setData({
            rgb : rgb
        })
      },

      //点击复制颜色
    copy() {
        wx.setClipboardData({
            data:this.data.rgb,
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

    tocC(){
        let str = (this.data.rgb).slice(4,-1).split(',');
        wx.navigateTo({
          url: '/pages/colorConvert/colorConvert?color=' + JSON.stringify(str) ,
        })
    },
    
  
    onLoad(options) {
        
    },

 
})