var pageNum1 = 1;
var pageNum2 = 1;
var pageSize = 20;
var gradientList = null

Page({

    data: {
        type: 'collocation',
        List1: [],
        List2: [],
    },

    onLoad() {
        this.getColor(this.data.type)
    },

    getColor(e) {
        wx.showLoading({
            title: '配色加载中...'
        })
        var type = e
        if (e.currentTarget) {
            type = e.currentTarget.dataset.type
        }
        if (type == 'collocation') {
            wx.request({
                url: 'http://localhost:3000/api/colorCombination',
                method: 'POST',
                data: {
                    pageNum1: pageNum1,
                    pageSize: pageSize
                },
                success: res => {
                    // console.log(res)
                    this.setData({
                        type: 'collocation',
                        List1: this.data.List1.concat(res.data)
                    })
                    pageNum1 += 1;
                },
                complete: () => {
                    wx.hideLoading()

                }

            })
        }
        if (type == 'gradient') {
            if (gradientList == null) {
                wx.request({
                    url: 'http://localhost:3000/api/gradientColorsApi',
                    success: res => {
                        console.log(res)
                        gradientList = res.data
                        this.pagination(pageNum2, pageSize, gradientList)
                        this.setData({
                            type: 'gradient',
                        })
                    },
                    complete: () => {
                        wx.hideLoading()

                    }
                })
            } else {
                if (this.data.List2.length == gradientList.length && this.data.List2.length != 0) {
                    wx.showToast({
                        title: '已加载全部',
                        icon: 'success',
                        duration: 2000
                      })
                }else{
                    this.pagination(pageNum2, pageSize, gradientList)
                }
                
            }
        }
    },

    //将渐变色json分页
    pagination(page, number, Json_data) { //获取分页数据 page为页number为要获取的数量 Json_data为数据总数
        
            let counts = Json_data.length //获取数据总数
            let start = (page - 1) * number //获取开始值
            let end = (page) * number //获取结束值、
            let data = []
            if (start > counts) { //如果开始值大于总值就会返回空数组
                return false
            }
            if (end > counts) { //如果结束值比总值大就把结束值设为总值
                end = counts
            }
            for (let i = start; i < end; i++) { //存入数据
                data.push(Json_data[i])
            }
            this.setData({
                type: 'gradient',
                List2: this.data.List2.concat(data)
            })
            pageNum2 += 1;
            wx.hideLoading()

    


    },

    //标签转换
    onChange(e) {
        this.setData({
            type: e.detail.name
        })
        if(this.data.type == 'collocation'){
            pageNum2 = 1
            this.setData({
                List2: []
            })
            this.getColor(this.data.type)
        }
        if(this.data.type == 'gradient'){
            pageNum1 = 1
            this.setData({
                List1: []
            })
            this.getColor(this.data.type)
        }
        
    },

    //转到颜色编辑界面
    edit(e) {
        console.log(e)
        let colors = e.currentTarget.dataset.colors;
        wx.navigateTo({
            url: '../edit/edit?blendent=' + JSON.stringify({
                colors
            }) + '&type=' + e.currentTarget.dataset.type,
        })
    },

    //回到顶部
    handleBackTop() {
        wx.pageScrollTo({
            scrollTop: 0,
        })
    },

    onReachBottom() {
        this.getColor(this.data.type)
    },

})