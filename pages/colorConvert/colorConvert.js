Page({

    /**
     * 页面的初始数据
     */
    data: {
        convertData: [],
        color: {
            r: '0',
            g: '0',
            b: '0'
        }
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.color) {
            const arr = JSON.parse(options.color)
            console.log(arr);
            this.setData({
                'color.r': arr[0],
                'color.g': arr[1],
                'color.b': arr[2]
            })

        }
        this.convert()
    },

    inputR(e) {
        this.setData({
            'color.r': e.detail.value
        })
    },

    inputG(e) {
        this.setData({
            'color.g': e.detail.value
        })
    },

    inputB(e) {
        this.setData({
            'color.b': e.detail.value
        })
    },

    convert() {
        if (this.data.color.r <= 255 && this.data.color.g <= 255 && this.data.color.b <= 255) {
            wx.request({
                url: 'http://localhost:3000/api/convertApi',
                method: 'POST',
                data: {
                    r: this.data.color.r,
                    g: this.data.color.g,
                    b: this.data.color.b,
                    method: 'rgb'
                },
                success: res => {
                    console.log(res)
                    this.setData({
                        convertData: res.data
                    })
                }
            })
        }else{
            wx.showToast({
              title: '单值须小于255',
              icon :'error'
            })
        }
    },

})